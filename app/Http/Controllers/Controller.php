<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\Request;
use App\Exceptions\PortailException;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

	/**
	 * Permet de savoir quoi afficher
	 * @param  Request $request
	 * @param  array   $choices
	 * @return array
	 */
	protected function getChoices(Request $request, array $choices) {
		$only = $request->input('only') ? explode(',', $request->input('only')) : [];
		$except = $request->input('except') ? explode(',', $request->input('except')) : [];

		if (count(array_intersect($only, $choices)) !== count($only) || count(array_intersect($except, $choices)) !== count($except))
			throw new PortailException('Il n\'est possible de spécifier pour only et except que: '.implode(', ', $choices));

		if (count($only) > 0)
			$choices = $only;

		foreach ($except as $choice) {
			if (($key = array_search($choice, $choices)) !== false)
			    unset($choices[$key]);
		}

		return $choices;
	}

	protected function hideUsersData(Request $request, $users, bool $hidePivot = true) {
		$toHide = [];

		if ($users === null)
			return;

		foreach ($users as $user) {
            $user->name = $user->firstname.' '.strtoupper($user->lastname);
			$user->makeHidden(['firstname', 'lastname', 'email', 'last_login_at', 'created_at', 'updated_at']);
			$this->hidePivotData($request, $user, $hidePivot);
		}

		return $users;
	}

	protected function hideUserData(Request $request, $user, bool $hidePivot = true) {
		$toHide = [];

		if ($user === null)
			return;

        $user->name = $user->firstname.' '.strtoupper($user->lastname);

        if ($user->id === \Auth::id())
            $user->me = true;

        $user->makeHidden(['firstname', 'lastname', 'email', 'last_login_at', 'created_at', 'updated_at']);

		return $this->hidePivotData($request, $user, $hidePivot);
	}

	protected function hidePivotData(Request $request, $model, bool $hidePivot = true) {
		if ($model === null)
			return;

		if ($hidePivot)
			$model->makeHidden('pivot');
		else {
			$model->pivot->makeHidden(['group_id', 'user_id']);

			if ($model->pivot->semester_id === 0)
				$model->pivot->makeHidden('semester_id');

			if (is_null($model->pivot->role_id))
				$model->pivot->makeHidden('role_id');

			if (is_null($model->pivot->validated_by))
				$model->pivot->makeHidden('validated_by');
		}

		return $model;
	}
}
