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
            print_r($results->getData()['searchEvents']['elements']);
            return response()->json($results->getData()['searchEvents']['elements']);

        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }

}
?>