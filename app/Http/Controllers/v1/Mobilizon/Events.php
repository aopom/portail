<?php

namespace App\Http\Controllers\v1\Mobilizon;
use GuzzleHttp\Client;

class Events {
    public function index(Request $request): JsonResponse{

        $client = new GuzzleHttp\Client();
        $res = $client->request('GET', 'https://mobitest.ppom.me/graphiql');
        echo $res->getStatusCode();
    }
}
?>