import Ember from 'ember';
import Materialize from 'materialize';
//import firebase from 'firebase';

const { toast } = Materialize;

export default Ember.Controller.extend({

    firebaseApp: Ember.inject.service(),

    actions: {
        info(param) {
            toast(param, 5000, 'rounded #ffca28 amber lighten-1 black-text');
        },

        signIn(provider) {
            toast('Comprobando...', 1000, 'rounded #ffca28 amber lighten-1 black-text');
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
                        //let user = controller.store.findRecord('user', {filter:{uid:currentUser.uid}});
                        if (currentUser.emailVerified) {
                            controller.transitionToRoute('welcome');
                        } else {
                            toast('Valida tu correo', 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        }
                    }
                });
            let msg = '¡Bienvenid@ ';
            msg += auth.currentUser.email;
            msg += '!';
            toast(msg, 8000, 'rounded #ffca28 amber lighten-1 black-text');

            }, (error) => {
                if (error.code === 'auth/user-disabled') {
                    this.actions.info("¡inhabilitado!");
                    this.actions.info("Por alguna razón este usuario ha sido inhabilitado por la administración.");
                } else if (error.code === 'auth/user-not-found') {
                    this.actions.info("¡desconocido!");
                    this.actions.info("No se ha encontrado ningún cooperativista asociado a este correo. La cuenta podría haber sido eliminada.");
                    this.actions.info("Vamos a tratar de registrarte.");

// AQUÍ EMPIEZA LA CREACIÓN DE USUARIO SI RESULTA CORREO DESCONOCIDO
                    auth.createUserWithEmailAndPassword(
                        this.get('email'),
                        this.get('password')).
                    then((userResponse) => {
                        toast(userResponse.email, 8000, 'rounded #ffca28 amber lighten-1 black-text');
                        toast(userResponse);
                        const user = this.store.createRecord('user', {
                            uid: userResponse.uid,
                            email: userResponse.email,
                            displayName: userResponse.email,
                            phone: "",
                            emailVerified: userResponse.emailVerified,
                            phoneVerified: userResponse.emailVerified,
                            home: "",
                            photoURL: "",
                            status: userResponse.status,
                            isAdmin: false,
                            isOwner: true,
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
                            controller.transitionToRoute('welcome');
                        }, (error) => {
                            toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        });
                        this.transitionToRoute('welcome');
                        auth.onAuthStateChanged(function(user) {
                            if (user.emailVerified) {
                                toast("El email está validado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                            } else {
                                toast("El email NO está validado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                            }
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


// AQUÍ ACABA LA CREACIÓN DE USUARIO SI RESULTA CORREO DESCONOCIDO





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
            Materialize.toast('Cerrando sesión', 1000, 'rounded #ffca28 amber lighten-1 black-text');
            //Ember.$.delay(3000);
            this.get('session').close();
            this.transitionToRoute('/');
            Materialize.toast('Se ha cerrando sesión', 2000, 'rounded red black-text');
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
*/        }

    }
});