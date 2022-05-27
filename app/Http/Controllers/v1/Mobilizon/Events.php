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
                            (new Query('physicalAddress'))
                                ->setSelectionSet(
                                    [
                                        'country',
                                        'street',
                                        'geom',
                                        'postalCode',
                                        'locality',
                                        'region',
                                    ]
                                ),
                        (new Query('picture'))
                                ->setSelectionSet(
                                    [
                                        'url'
                                    ]
                                ),
                            (new Query ('organizerActor'))
                                -> setSelectionSet(
                                    [
                                        'name'
                                    ]
                                )
                        ]
                    )
                ]
            );
        try {
        
            $results = $client->runQuery($gql, true);
            return response()->json($results->getData()['searchEvents']['elements']);

        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }

    /**
     * Show a calendar.
     *
     * @param Request	$request
     * @param string 	$shortname
     * @return JsonResponse
     */
    public function show(Request $request, string $shortname): JsonResponse{
        try{
            $client = new Client(
                    'https://mobitest.ppom.me/graphiql'
            );
        }catch(ConnectExeption $exception){
            print_r( $exception->getErrorDetails());
        }
    
        $gql = (new Query('group'))
            ->setVariables([new Variable('preferredUsername', 'String')])
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
                            (new Query('physicalAddress'))->setSelectionSet([
                                'country',
                                'street',
                                'geom',
                                'postalCode',
                                'locality',
                                'region',
                            ]),
                            (new Query('picture'))->setSelectionSet([
                                'url'
                            ]),
                            (new Query ('organizerActor'))-> setSelectionSet([
                                'name'
                            ])
                            ])
                        ])
                ]
            );
        try {
        
            $results = $client->runQuery($gql, true, ['preferredUsername' => "bde"] );
            return response()->json($results->getData()['group']['organizedEvents']['elements']);
            print_r(response()->json($results->getData()['group']['organizedEvents']['elements']));
        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }

}
?>