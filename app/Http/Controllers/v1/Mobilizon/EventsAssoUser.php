<?php
namespace App\Http\Controllers\v1\Mobilizon;
use App\Http\Controllers\v1\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use GraphQL\Query;
use GraphQL\Client;
use GraphQL\Variable;

class AssoController extends Controller
{
    use HasUserBulkMethods, HasAssos;

    /**
     * Must be able to manage user's association.
     */
    public function __construct()
    {
        $this->middleware(
            \Scopes::matchOneOfDeepestChildren('user-get-assos-members', 'client-get-assos-members'),
            ['only' => ['index', 'show']]
        );
    }

    /**
     * List user's associations.
     *
     * @param Request $request
     * @param string  $user_id
     * @return JsonResponse
     */
    public function index(Request $request, string $user_id=null): JsonResponse
    {
        $user = $this->getUser($request, $user_id);
        $choices = $this->getChoices($request, ['joined', 'joining', 'followed']);
        $semester = $this->getSemester($request, $choices);

        $assos = collect();

        if (in_array('joined', $choices)) {
            $assos = $assos->merge($user->joinedAssos()->with('parent')->where('semester_id', $semester->id)->get());
        }

        if (in_array('joining', $choices)) {
            $assos = $assos->merge($user->joiningAssos()->with('parent')->where('semester_id', $semester->id)->get());
        }

        if (in_array('followed', $choices)) {
            $assos = $assos->merge($user->followedAssos()->with('parent')->where('semester_id', $semester->id)->get());
        }

        return response()->json($assos->map(function ($asso) {
            return $asso->hideData();
        }), 200);
    }
}

?>