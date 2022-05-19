<?php

namespace App\Http\Controllers\v1\Mobilizon;
use GuzzleHttp\Client;
use App\Http\Controllers\v1\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Events extends Controller{
    
    public function index(Request $request): JsonResponse{

        $client = new GuzzleHttp\Client();
        $res = $client->request('GET', 'https://mobitest.ppom.me/graphiql');
        echo $res->getStatusCode();
    }
}
?>