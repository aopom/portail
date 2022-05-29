<?php
namespace App\Http\Controllers\v1\Mobilizon;
use App\Http\Controllers\v1\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use GraphQL\Query;
use GraphQL\Client;
use GraphQL\Variable;
use App\Http\Requests\UserAssoRequest;
use App\Models\Asso;
use App\Models\Semester;
use App\Models\Role;
use App\Exceptions\PortailException;
use App\Traits\Controller\v1\{
    HasUsers, HasUserBulkMethods, HasAssos

};
class EventsAssoUser extends Controller{
    use HasUsers, HasUserBulkMethods, HasAssos;

    /**
     * List user's associations.
     *
     * @param Request $request
     * @param string  $user_id
     * @return JsonResponse
     */
    public function index(Request $request, string $user_id=null)
    {
        $user = $this->getUser($request, $user_id);
        $choices = $this->getChoices($request, ['joined', 'joining', 'followed']);
        $semester = $this->getSemester($request, $choices);
        print_r($user);
        
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

       print_r($assos);
      
    }
}

?>