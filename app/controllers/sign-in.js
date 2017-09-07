import Ember from 'ember';
import Materialize from 'materialize';
//import firebase from 'firebase';

const { toast } = Materialize;

export default Ember.Controller.extend({

    firebaseApp: Ember.inject.service(),

    modalIsOpen: false,

    displayName: "usuari@",

    actions: {
        info(param) {
            toast(param, 5000, 'rounded');
        },

        closeModal() {
            this.toggleProperty('modalIsOpen');
        },

        agree() {
            this.toggleProperty('modalIsOpen');
        },

        signIn(provider) {
            toast('Comprobando...', 1000, 'rounded');
            let controller = this;
            const auth = this.get('firebaseApp').auth();

            this.get('session').open('firebase', {
                provider: provider,
                email: this.get('email') || '',
                password: this.get('password') || '',
            }).then(() => {
                controller.set('email', null);
                controller.set('password', null);

                auth.onAuthStateChanged(function(currentUser) {
                    if (currentUser) {
                        let user = controller.store.findRecord('user', currentUser.uid).then(() => {
                            toast(user.displayName, 6000, 'rounded #ffca28 amber lighten-1 black-text');
                            if (user && currentUser.emailVerified) {
                                user.emailVerified = true;
                                /*
                                                                user.save().then((model) => {
                                                                    let msg = "Actualizado ";
                                                                    if (model.name) {
                                                                        msg += model.name;
                                                                    }
                                                                    toast(msg, 6000, 'rounded #ffca28 amber lighten-1 black-text');
                                                                    this.transitionTo('/users/' + currentUser.uid + '/edit');
                                                                }, (error) => {
                                                                    toast(error, 5000, 'rounded red lighten-1 black-text');
                                                                });*/

                                controller.transitionToRoute('/users/' + currentUser.uid + '/edit');
                            } else {
                                toast('Valida tu correo', 5000, 'rounded #ffca28 amber lighten-1 black-text');
                                controller.transitionToRoute('/users/' + currentUser.uid + '/edit');
                            }
                        }, (error) => {
                            toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        });
                    }
                });
                controller.transitionToRoute('/users/' + auth.currentUser.uid + '/edit');
                toast('¡Bienvenid@! ' + auth.currentUser.displayName, 4000, 'rounded green lighten-1 black-text');

            }, (error) => {
                if (error.code === 'auth/user-disabled') {
                    this.actions.info("¡inhabilitado!");
                    this.actions.info("Por alguna razón este usuario ha sido inhabilitado por la administración.");
                } else if (error.code === 'auth/user-not-found') {
                    this.actions.info("¡desconocido!");
                    this.actions.info("No se ha encontrado ningún cooperativista asociado a este correo. La cuenta podría haber sido eliminada.");
                    this.actions.info("Vamos a tratar de registrarte.");
                    this.toggleProperty('modalIsOpen');
                } else if (error.code === 'auth/wrong-password') {
                    this.actions.info("¡Nooop!")
                    this.actions.info("La clave no es correcta o el cooperativista no tiene clave.")
                } else if (error.code === 'auth/invalid-email') {
                    this.actions.info("¡uuups!");
                    this.actions.info("La dirección de correo electrócico no está bien escrita.");
                } else {
                    this.actions.info(error.code);
                    this.actions.info(error.message);
                    controller.set('email', null);
                    controller.set('password', null);
                }
            });
        },

        deleteUser() {
            toast("Eliminando...");
            const auth = this.get('firebaseApp').auth();
            auth.currentUser.delete().
            then(() => {
                toast("Eliminado");
            }, (error) => {
                if (error) {
                    this.actions.info(error.code);
                    this.actions.info(error.message);
                }
            });
        },

        createUser() {
            //https://cooperativapp-cbdd9.firebaseapp.com/favicon-e1b3bba069c4b1df17523912d2e14f78.png
            toast('Creando...', 1000, 'rounded');
            let controller = this;
            const auth = this.get('firebaseApp').auth();
            auth.createUserWithEmailAndPassword(
                this.get('email'),
                this.get('password')).
            then((userResponse) => {
                    toast(userResponse.email, 8000, 'rounded #ffca28 amber lighten-1 black-text');
                    toast(userResponse);
                    const user = this.store.createRecord('user', {
                        id: userResponse.uid,
                        email: userResponse.email,
                        displayName: controller.get('displayName'),
                        phone: "",
                        emailVerified: userResponse.emailVerified,
                        phoneVerified: userResponse.phoneVerified,
                        home: "",
                        photoURL: "http://funnyfrontend.com/wp-content/uploads/2015/11/anonymous-avatar.jpg",
                        status: userResponse.status,
                        isAdmin: false,
                        isOwner: false,
                        isRenter: false,
                        isGuest: false,
                        isActive: false
                    });
                    auth.currentUser.sendEmailVerification().then(function() {
                        toast("Se ha enviado un correo de confirmación.", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    });

                    this.get('session').open('firebase', {
                        provider: 'password',
                        email: this.get('email') || '',
                        password: this.get('password') || '',
                    }).then(() => {
                        controller.set('email', null);
                        controller.set('password', null);
                        controller.transitionToRoute('/users/' + auth.currentUser.uid + '/edit');
                    }, (error) => {
                        toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    });
                    this.transitionToRoute('/users/' + auth.currentUser.uid + '/edit');
                    let unsubscribe = auth.onAuthStateChanged(function(user) {
                        if (user) {
                            toast("Creando " + user.displayName, 5000, 'rounded green lighten-1 black-text');
                        } else {
                            toast(".", 1000, 'rounded red lighten-1 black-text');
                        }
                        unsubscribe();
                    });
                    return user.save();
                }, (error) => {
                    if (error) {
                        toast(error.code, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        toast(error.message, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        controller.set('email', null);
                        controller.set('password', null);
                    }
                }

            );
        },

        sendPasswordReset() {
            var email = this.get('email');
            let controller = this;
            this.actions.info("Reseteando...");
            const auth = controller.get('firebaseApp').auth();
            auth.sendPasswordResetEmail(email).then(function() {
                toast("Enviado correo de reseteo", 5000, 'rounded #ffca28 amber lighten-1 black-text');
            }).catch(function(error) {
                if (error.code === 'auth/invalid-email') {
                    toast("Correo no válido", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                } else if (error.code === 'auth/user-not-found') {
                    toast("Correo no encontrado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                } else {
                    toast(error.code, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    toast(error.message, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    controller.set('email', null);
                    controller.set('password', null);
                }
            });
        },

        signOut() {
            toast('Cerrando sesión', 1000, 'rounded');
            this.get('session').close();
            this.transitionToRoute('/');
            toast('Se ha cerrando sesión', 2000, 'rounded');
        },

        googleSignIn() {
            this.actions.info('Conectando con google');
            /*
            let provider = new this.get('firebaseApp').auth.GoogleAuthProvider();
                        //const auth = this.get('firebaseApp').auth();
            provider.addScope('profile');
            provider.addScope('email');
            //			let controller = this;
            //            const auth = this.get('firebaseApp').auth();
            //            let provider = auth.GoogleAuthProvider;
                        auth.signInWithPopup(provider).then(function(result) {
                            // This gives you a Google Access Token. You can use it to access the Google API.
                            var token = result.credential.accessToken;
                            // The signed-in user info.
                            var user = result.user;
                            // ...
                        }).catch(function(error) {
                            // Handle Errors here.
                            var errorCode = error.code;
                            var errorMessage = error.message;
                            // The email of the user's account used.
                            var email = error.email;
                            // The firebase.auth.AuthCredential type that was used.
                            var credential = error.credential;
                            this.actions.info(error);
                        });
            */
        }

    }
});