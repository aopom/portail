import React, { Component } from 'react';

class Clients extends Component { 
    constructor(props) { 
        super(props); 
 
        this.state = { 
            clients: [],
            client: [],
            scopes: [],
            form: {
                errors: [],
                name: '',
                asso_id: 1,
                redirect: '',
                scopes: []
            }
        } 
    }

    componentDidMount() {
        this.getClients();
        this.getTokens();
    }

    getClients() {
        axios.get('/oauth/clients').then(response => {
            this.setState({ clients: response.data });
        });
    }

    getTokens() {
        axios.get('/oauth/scopes').then(response => {
            var scopes = [];

            Object.keys(response.data).forEach(function(key) {
                if (key.startsWith('client')) {
                    scopes.push({
                        'name': key,
                        'description': response.data[key]
                    });
                }
            });

            this.setState({ scopes: scopes });
        });
    }

    viewClient(client, e) {
        this.setState({ client: client });

        //$('#viewClient').modal('show');
    }

    handleInputChange(e) {
        const name = e.target.name;
        const value = e.target.value;  
        const oldForm = this.state.form;

        var form = {
            errors: oldForm.errors,
            name: oldForm.name,
            asso_id: oldForm.asso_id,
            redirect: oldForm.redirect,
            scopes: oldForm.scopes
        }

        if (name === "scope") {
            const i = form.scopes.indexOf(value);
            if (i == -1) {
                form.scopes.push(value);
            } else {
                form.scopes.splice(i, 1);
            }
        } else {
            form[name] = e.target.value;
        }

        // console.log(form);

        this.setState({ form: form });
    }

    handleSubmit(method, url, e) {
        e.preventDefault();

        var form = this.state.form;
        form.errors = [];

        axios({ method: method, url: url, data: form })
            .then(response => {
                this.getClients();
                
                document.getElementById("hideModalBtn").click();

                var form = {
                    errors: [],
                    name: '',
                    asso_id: '',
                    redirect: '',
                    scopes: []
                }

                this.setState({ form: form });
            })
            .catch(error => {                
                form.errors = ['Une erreur est survenue. Veuillez réessayer'];
                this.setState({ form: form });
            });
    }

    render() {
        return (
            <div>
                <div className="card drop-shadow mb-4">
                    <div className="card-body">
                        <div className="row">
                            <div className="col-6">
                                <h5><b>Clients OAuth</b></h5>
                            </div>

                            <div className="col-6 text-right">
                                <a className="btn btn-primary" href="#createModal" data-toggle="modal">Créer un client</a>
                            </div>
                        </div>

                        { this.state.clients.length > 0 ? (
                            this.state.clients.map((client, i) => 
                                <dl key={i} className="row mt-3 mb-0">
                                    <dt className="col-sm-3">
                                        <span className="d-block mb-2">{ client.name }</span> 
                                        <button className="btn btn-primary btn-sm mb-1 mr-1" onClick={ (e) => this.viewClient(client, e) }>
                                            Voir
                                        </button>
                                        <button className="btn btn-primary btn-sm mb-1" click="edit(client)">
                                            Modifier
                                        </button>
                                    </dt>
                                    <dd className="col-sm-9">
                                        ID Client : { client.id } <br/>
                                        ID Asso : { client.asso_id } <br />
                                        Secret : <code>{ client.secret }</code> <br />
                                    </dd>
                                </dl>
                            )
                        ) : (
                            <p className="mt-3 mb-0">Vous n'avez pas encore crée de client OAuth.</p>
                        )}
                    </div>
                </div>

                <div className="modal fade" id="createModal" tabindex="-1" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <h4><b>Créer un client</b></h4>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button id="hideModalBtn" type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    </div>
                                </div>

                                { this.state.form.errors.length > 0 ? (
                                    <div className="alert alert-danger" v-if="form.errors.length > 0">
                                        <p className="mb-0"><strong>Erreur</strong></p>
                                        <br />
                                        Une erreur est survenue. Veuillez réessayer.
                                    </div>
                                ) : (<span></span>)}

                                <form onSubmit={ (e) => this.handleSubmit('post', 'oauth/clients', e) }>
                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">Nom :</label>

                                        <div className="col-md-9">
                                            <input id="create-client-name" type="text" className="form-control" name="name" onChange={ (e) => this.handleInputChange(e) } />

                                            <span className="form-text text-muted">Le nom qui s'affichera pour vos utilisateurs.</span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">ID Asso :</label>

                                        <div className="col-md-9">
                                            <input name="asso_id" type="number" min="0" className="form-control" onChange={ (e) => this.handleInputChange(e) } />

                                            <span className="form-text text-muted">
                                                L'ID de l'asso pour qui la clé est créee.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">Redirection :</label>

                                        <div className="col-md-9">
                                            <input type="text" className="form-control" name="redirect" onChange={ (e) => this.handleInputChange(e) } />

                                            <span className="form-text text-muted">
                                                Adresse de redirection après authentification.
                                            </span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">Scopes :</label>

                                        <div className="col-md-9">
                                            { this.state.scopes.length > 0 ? (
                                                this.state.scopes.map((scope, i) =>
                                                    <div key={i} className="checkbox">
                                                        <label>
                                                            <input type="checkbox" name="scope" value={ scope.name } onChange={ (e) => this.handleInputChange(e) } />
                                                            &nbsp;
                                                            <span data-toggle="tooltip" data-placement="right" title={ scope.description }>{ scope.name }</span>
                                                        </label>
                                                    </div>
                                                )
                                            ) : (
                                                <span></span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-6 text-left">
                                            <button type="button" className="btn btn-primary" data-dismiss="modal">Annuler</button>
                                        </div>
                                        <div className="col-6 text-right">
                                            <button type="submit" className="btn btn-primary">Créer le client</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="modal fade" id="viewModal" tabindex="-1" role="dialog">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="row mb-3">
                                    <div className="col-6">
                                        <h4><b>Voir</b></h4>
                                    </div>
                                    <div className="col-6 text-right">
                                        <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
                                    </div>
                                </div>

                                <form role="form">
                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">Nom :</label>

                                        <div className="col-md-9">
                                            <input type="text" disabled className="form-control" />

                                            <span className="form-text text-muted">Le nom qui s'affichera pour vos utilisateurs.</span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">ID Asso :</label>

                                        <div className="col-md-9">
                                            <input type="number" min="0" disabled className="form-control" />

                                            <span className="form-text text-muted">L'ID de l'asso pour qui la clé est créee.</span>
                                        </div>
                                    </div>

                                    <div className="form-group row">
                                        <label className="col-md-3 col-form-label">Redirection :</label>

                                        <div className="col-md-9">
                                            <input type="text" className="form-control" disabled name="redirect" />

                                            <span className="form-text text-muted">Adresse de redirection après authentification.</span>
                                        </div>
                                    </div>

                                    <div className="form-group row" v-if="form.scopes.length > 0">
                                        <label className="col-md-3 col-form-label">Scopes :</label>

                                        <div className="col-md-9">
                                            <span className="d-block mb-1" v-for="scope in form.scopes">
                                                <code>scope</code> : scopes[scope]
                                            </span>
                                        </div>
                                    </div>
                                </form>

                                <div className="row">
                                    <div className="col-12 text-right">
                                        <button type="button" className="btn btn-primary" data-dismiss="modal">Fermer</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );


        // <div className="modal fade" id="modal-edit-client" tabindex="-1" role="dialog">
        //     <div className="modal-dialog modal-lg">
        //         <div className="modal-content">
        //             <div className="modal-body">
        //                 <div className="row mb-3">
        //                     <div className="col-6">
        //                         <h4><b>Modifier un client</b></h4>
        //                     </div>
        //                     <div className="col-6 text-right">
        //                         <button type="button" className="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        //                     </div>
        //                 </div>

        //                 <div className="alert alert-danger" v-if="form.errors.length > 0">
        //                     <p className="mb-0"><strong>Erreur</strong></p>
        //                     <br>
        //                     <ul>
        //                         <li v-for="error in form.errors">
        //                             {{ error }}
        //                         </li>
        //                     </ul>
        //                 </div>

        //                 <form role="form">
        //                     <div className="form-group row">
        //                         <label className="col-md-3 col-form-label">Nom :</label>

        //                         <div className="col-md-9">
        //                             <input id="edit-client-name" type="text" className="form-control"
        //                                                         keyup.enter="update" v-model="form.name">

        //                             <span className="form-text text-muted">Le nom qui s'affichera pour vos utilisateurs.</span>
        //                         </div>
        //                     </div>

        //                     <div className="form-group row">
        //                         <label className="col-md-3 col-form-label">Redirection :</label>

        //                         <div className="col-md-9">
        //                             <input type="text" className="form-control" name="redirect"
        //                                             keyup.enter="update" v-model="form.redirect">

        //                             <span className="form-text text-muted">Adresse de redirection après authentification.</span>
        //                         </div>
        //                     </div>

        //                     <div className="form-group row">
        //                         <label className="col-md-3 col-form-label">Scopes :</label>

        //                         <div className="col-md-9">
        //                             <div v-for="(description, name) in scopes" v-if="name.startsWith('client')">
        //                                 <div className="checkbox">
        //                                     <label>
        //                                         <input type="checkbox"
        //                                             click="toggleScope(name)"
        //                                             :checked="scopeIsAssigned(name)">

        //                                             &nbsp;

        //                                             <span data-toggle="tooltip" data-placement="right" :title="description">{{ name }}</span>
        //                                     </label>
        //                                 </div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </form>

        //                 <div className="row">
        //                     <div className="col-6 text-left">
        //                         <button type="button" className="btn btn-primary" data-dismiss="modal">Annuler</button>
        //                     </div>
        //                     <div className="col-6 text-right">
        //                         <button type="button" className="btn btn-danger mr-2" data-dismiss="modal" click="destroy">Supprimer</button>
        //                         <button type="button" className="btn btn-primary" click="store">Modifier le client</button>
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
    }
}

export default Clients;