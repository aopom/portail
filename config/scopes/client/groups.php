<?php

/*
 * Liste des scopes en fonction des routes
 *   - Définition des scopes:
 *      portée + "-" + verbe + "-" + categorie + (pour chaque sous-catégorie: '-' + sous-catégorie)
 *      ex: user-get-user user-get-user-assos user-get-user-assos-followed
 *
 *   - Définition de la portée des scopes:
 *     + user :    user_credential => nécessite que l'application soit connecté à un utilisateur
 *     + client :  client_credential => nécessite que l'application est les droits d'application indépendante d'un utilisateur
 *
 *   - Définition du verbe:
 *     + manage:  gestion de la ressource entière
 *       + set :  posibilité d'écrire et modifier les données
 *         + get :  récupération des informations en lecture seule
 *         + create:  créer une donnée associée
 *         + edit:    modifier une donnée
 *       + remove:  supprimer une donnée
 */

// Toutes les routes commencant par client-{verbe}-groups-
return [
    'description' => 'Groupes',
    'verbs' => [
        'manage' => [
            'description' => 'Gérer les groupes des utilisateursr',
			'scopes' => [
				'enabled' => [
					'description' => 'Gérer les groupes actifs des utilisateursr',
				],
				'disabled' => [
					'description' => 'Gérer les groupes inactifs des utilisateursr',
				],
			]
        ],
	    'get' => [
	        'description' => 'Récupérer les groupes des utilisateursr',
			'scopes' => [
				'enabled' => [
					'description' => 'Récupérer les groupes actifs des utilisateursr',
				],
				'disabled' => [
					'description' => 'Récupérer les groupes inactifs des utilisateursr',
				],
			]
	    ],
	    'set' => [
	        'description' => 'Modifier les groupes des utilisateursr',
			'scopes' => [
				'enabled' => [
					'description' => 'Modifier les groupes actifs des utilisateursr',
				],
				'disabled' => [
					'description' => 'Modifier les groupes inactifs des utilisateursr',
				],
			]
	    ],
    ]
];
