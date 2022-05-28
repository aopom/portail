<?php

namespace App\Http\Controllers\v1\Mobilizon;
use App\Http\Controllers\v1\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use GraphQL\Query;
use GraphQL\Client;
use GraphQL\Variable;


class Events extends Controller{
    public function __construct()
    {
        $this->middleware(
            \Scopes::allowPublic()->matchOneOfDeepestChildren('user-get-events', 'client-get-events'),
            ['only' => ['all', 'get']]
        );
       
    }
    public function index(Request $request): JsonResponse{

        try{
            $client = new Client(
                    'https://mobitest.ppom.me/graphiql'
            );
        }catch(ConnectExeption $exception){
            print_r( $exception->getErrorDetails());
        }
    
        $gql = (new Query('searchEvents'))
            ->setSelectionSet(
                [
                (new Query('elements'))
                    ->setSelectionSet(
                        [
                            'id',
                            'status',
                            'category',
                            'title',
                            'url',
                            'joinOptions',
                            'description',
                            'beginsOn',
                            'endsOn',
                            (new Query ('organizerActor'))-> setSelectionSet([
                                'name'
                            ]
                            )
                        ]
                    )
                ]
            );
        try {
        
            $results = $client->runQuery($gql, true);
            //print_r(response()->json($results->getData()['searchEvents']['elements']));
            return response()->json($results->getData()['searchEvents']['elements']);

        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }
     /**
     * Show a calendar event.
     *
     * @param Request	$request
     * @param string 	$shortname
     * @return JsonResponse
     */

    public function show(Request $request, string $shortname){
        try{
            $client = new Client(
                'https://mobitest.ppom.me/graphiql'
            );
        }catch(ConnectExeption $exception){
            print_r( $exception->getErrorDetails());
        }
    
        $gql = (new Query('group'))
            ->setVariables([new Variable('preferredUsername', 'String', true)])
            ->setArguments(['preferredUsername' => '$preferredUsername'])

            ->setSelectionSet([
                (new Query('organizedEvents'))->setSelectionSet([
                    (new Query('elements'))->setSelectionSet([
                            'id',
                            'status',
                            'category',
                            'title',
                            'url',
                            'joinOptions',
                            'description',
                            'beginsOn',
                            'endsOn',
                            (new Query ('organizerActor'))-> setSelectionSet([
                                'name'
                            ])
                            ])
                        ])
                ]
            );
        try {
            $preferredUsername = "bde";
            $results = $client->runQuery($gql, true, ['preferredUsername' => $preferredUsername]);

            print_r($shortname);

            //return response()->json($results->getData()['group']['organizedEvents']['elements'], 200);

        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }

}
?>