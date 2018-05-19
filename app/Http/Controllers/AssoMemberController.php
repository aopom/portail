<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\Asso;
use App\Models\Semester;
use App\Models\Role;
use App\Http\Requests\AssoRequest;
use App\Services\Visible\Visible;
use App\Models\Visibility;
use App\Exceptions\PortailException;

class AssoMemberController extends Controller
{
    public function __construct() {
		$this->middleware(
			array_merge(
                \Scopes::matchOne(
                    ['user-get-assos-joined-now', 'user-get-assos-followed-now']
    			),\Scopes::matchOne(
    				['user-get-roles-assos']
    			)
            ),
			['only' => ['index', 'show']]
		);
		$this->middleware(
			array_merge(
                \Scopes::matchOne(
                    ['user-set-assos-joined-now', 'user-set-assos-followed-now']
    			),\Scopes::matchOne(
    				['user-set-roles-assos']
    			)
            ),
			['only' => ['store', 'update']]
		);
		$this->middleware(
			array_merge(
                \Scopes::matchOne(
                    ['user-manage-assos-joined-now', 'user-manage-assos-followed-now']
    			),\Scopes::matchOne(
    				['user-manage-roles-assos']
    			)
            ),
			['only' => ['destroy']]
		);
    }

	protected function getAsso(Request $request, int $asso_id) {
		$asso = Asso::find($asso_id);

		if ($asso)
			return $asso;
		else
			abort(404, "Assocation non trouvée");
	}

	protected function hideUsersData(Request $request, $users, bool $hidePivot = false) {
		return parent::hideUsersData($request, $users, $hidePivot);
	}

	protected function hideUserData(Request $request, $user, bool $hidePivot = false) {
		return parent::hideUserData($request, $user, $hidePivot);
	}

    /**
     * On ajoute les droits admin en fonction du rôle qu'on a dans les assos
     * @param Model  $asso
     * @param Model  $pivot
     * @return false/string renvoie le type du role ajouté
     */
    protected function addUserRoles($asso, $pivot) {
        if (!is_null($pivot->validated_by)) {
            $adminAssos = config('portail.assos', []);
            if (isset($adminAssos[$asso->login])) {
                $adminRoles = $adminAssos[$asso->login];
                $role = Role::getRole($pivot->role_id);

                if (isset($adminRoles[$role->type])) {
                    try {
                        \Auth::user()->assignRoles($adminRoles[$role->type], [
                            'validated_by' => \Auth::id(),
                        ], true);

                        return $adminRoles[$role->type];
                    }
                    catch (\Exception $e) {
                        // Dans le cas où on possède déjà ce rôle
                    }
                }
            }
        }

        return false;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request, int $asso_id) {
		$asso = $this->getAsso($request, $asso_id);
		$choices = $this->getChoices($request, ['members', 'joiners', 'followers']);
		$semester = Semester::getSemester($request->input('semester')) ?? Semester::getThisSemester();
		$members = collect();

		if ($request->input('semester') && !\Scopes::hasOne($request, ['user-get-assos-joined', 'user-get-assos-joining', 'user-get-assos-followed']))
			throw new PortailException('Il n\'est pas possible de définir un semestre particulier sans les scopes user-get-assos-joined ou user-get-assos-joining ou user-get-assos-followeds');

		if (\Scopes::has($request, 'user-get-assos-joined-now') && in_array('members', $choices))
			$members = $members->merge($asso->members()->where('semester_id', $semester->id)->get());

		if (\Scopes::has($request, 'user-get-assos-joining-now') && in_array('joiners', $choices))
			$members = $members->merge($asso->joiners()->where('semester_id', $semester->id)->get());

		if (\Scopes::has($request, 'user-get-assos-followed-now') && in_array('followers', $choices))
			$members = $members->merge($asso->followers()->where('semester_id', $semester->id)->get());

		return response()->json($this->hideUsersData($request, $members), 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request, int $asso_id) {
		$asso = $this->getAsso($request, $asso_id);

		if (\Scopes::isUserToken($request)) {
			if ($request->input('role_id')) {
                if (!\Scopes::hasOne($request, ['user-set-assos-joining-now', 'user-set-assos-joined-now']))
                    abort(403, 'Vous n\'être pas autorisé à assigner un rôle');

				$asso->assignMembers(\Auth::id(), [
					'role_id' => $request->input('role_id'),
				]);
			}
			else {
                if (!\Scopes::hasOne($request, ['user-set-assos-joining-now', 'user-set-assos-joined-now']))
                    abort(403, 'Vous n\'être pas autorisé à créer un membre sans rôle');

				$asso->assignMembers(\Auth::id(), [
					'validated_by' => \Auth::id(),
				]);
			}

			$member = $asso->allMembers()->wherePivot('user_id', \Auth::id())->first();
		}

        if ($new = $this->addUserRoles($asso, $member->pivot))
            $member->new_user_role = $new;

		return response()->json($this->hideUserData($request, $member));
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Request $request, int $asso_id, int $member_id) {
		$asso = $this->getAsso($request, $asso_id);
        $choices = $this->getChoices($request, ['members', 'joiners', 'followers']);
		$semester = Semester::getSemester($request->input('semester')) ?? Semester::getThisSemester();
        $member = null;

		if ($request->input('semester') && !\Scopes::hasOne($request, ['user-get-assos-joined', 'user-get-assos-joining', 'user-get-assos-followed']))
			throw new PortailException('Il n\'est pas possible de définir un semestre particulier sans les scopes user-get-assos-joined ou user-get-assos-joining ou user-get-assos-followeds');

		if (\Scopes::has($request, 'user-get-assos-joined-now') && in_array('members', $choices))
			$member = $asso->members()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-joining-now') && in_array('joiners', $choices))
            $member = $asso->joiners()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-followed-now') && in_array('followers', $choices))
            $member = $asso->followers()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if ($member)
			return response()->json($this->hideUserData($request, $member));
		else
			abort(404, 'Cette personne ne fait pas partie de l\'association (ou vous ne pouvez pas le voir)');
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, int $asso_id, int $member_id) {
		$asso = $this->getAsso($request, $asso_id);
        $choices = $this->getChoices($request, ['members', 'joiners', 'followers']);
		$semester = Semester::getSemester($request->input('semester')) ?? Semester::getThisSemester();
        $member = null;

		if ($request->input('semester') && !\Scopes::hasOne($request, ['user-get-assos-joined', 'user-get-assos-joining', 'user-get-assos-followed']))
			throw new PortailException('Il n\'est pas possible de définir un semestre particulier sans les scopes user-get-assos-joined ou user-get-assos-joining ou user-get-assos-followeds');

		if (\Scopes::has($request, 'user-get-assos-joined-now') && in_array('members', $choices))
			$member = $asso->members()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-joining-now') && in_array('joiners', $choices))
            $member = $asso->joiners()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-followed-now') && in_array('followers', $choices))
            $member = $asso->followers()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if ($member) {
            $role_id = $request->input('role_id', $member->pivot->role_id);

            if ($request->input('role_id') && !\Scopes::hasOne($request, ['user-set-assos-joining-now', 'user-set-assos-joined-now']))
                abort(403, 'Vous n\'être pas autorisé à modifier un rôle');
            else if (is_null($request->input('role_id')) && !\Scopes::hasOne($request, ['user-set-assos-joining-now', 'user-set-assos-joined-now']))
                abort(403, 'Vous n\'être pas autorisé à créer un membre sans rôle');

            // Si le rôle qu'on veut valider est un rôle qui peut-être validé par héridité
            $force = Role::getRole(config('portail.roles.admin.assos'))->id === $role_id && $asso->getLastUserWithRole(config('portail.roles.admin.assos'))->id === \Auth::id();

            $asso->updateMembers($member_id, [
				'semester_id' => $member->pivot->semester_id,
			], [
				'role_id' => $role_id,
				'validated_by' => \Auth::id(),
			], $force);

            $member = $asso->currentAllMembers()->where('user_id', $member_id)->first();

            if ($new = $this->addUserRoles($asso, $member->pivot))
                $member->new_user_role = $new;

			return response()->json($this->hideUserData($request, $member));
		}
		else
			abort(404, 'Cette personne ne fait pas partie de l\'association');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Request $request, int $asso_id, int $member_id) {
        $choices = $this->getChoices($request, ['members', 'joiners', 'followers']);
		$semester = Semester::getSemester($request->input('semester')) ?? Semester::getThisSemester();
        $member = null;

		if ($request->input('semester') && !\Scopes::hasOne($request, ['user-get-assos-joined', 'user-get-assos-joining', 'user-get-assos-followed']))
			throw new PortailException('Il n\'est pas possible de définir un semestre particulier sans les scopes user-get-assos-joined ou user-get-assos-joining ou user-get-assos-followeds');

		if (\Scopes::has($request, 'user-get-assos-joined-now') && in_array('members', $choices))
			$member = $asso->members()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-joining-now') && in_array('joiners', $choices))
            $member = $asso->joiners()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if (is_null($member) && \Scopes::has($request, 'user-get-assos-followed-now') && in_array('followers', $choices))
            $member = $asso->followers()->where('semester_id', $semester->id)->wherePivot('user_id', $member_id)->first();

		if ($member) {
			$asso->removeMembers($member_id, [
				'semester_id' => $semester->id,
			], \Auth::id());

            abort(203);
		}
		else
			abort(404, 'Cette personne ne faisait déjà pas partie de l\'association (ou vous ne pouvez pas le voir)');
    }
}
