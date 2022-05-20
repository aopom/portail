<?php

namespace App\Http\Controllers\v1\Mobilizon;
use App\Http\Controllers\v1\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use GraphQL\Query;
use GraphQL\Client;

class Events extends Controller{
    
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
            echo $results;
            return response()->json($results);

        }catch (QueryException $exception) {
            print_r($exception->getErrorDetails());
            exit;
        }
    
    }
}
?>