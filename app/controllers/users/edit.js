import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Controller.extend({

    firebaseApp: Ember.inject.service(),

    reSetPassword: false,

    photoURL: Ember.computed('user', function() {
        const auth = this.get('firebaseApp').auth();
        if (auth.currentUser) {
            //toast(auth.currentUser.photoURL);
            return auth.currentUser.photoURL;
        } else {
            return null;
        }
    }),

    isCurrent: Ember.computed('user', function() {
        const auth = this.get('firebaseApp').auth();
        if (auth.currentUser) {
            //toast(auth.currentUser.email);
            return true;
        } else {
            return false;
        }
    }),

    actions: {
        info(param) {
            toast(param, 5000, 'rounded #ffca28 amber lighten-1 black-text');
        },

        saveUser(myModel) {
            const auth = this.get('firebaseApp').auth();
            let controller = this;
            //toast(controller.get('photoURL'));
            if (auth.currentUser) {
                auth.currentUser.updateProfile({
                    displayName: controller.get('displayName') || auth.currentUser.displayName,
                    photoURL: controller.get('photoURL') || auth.currentUser.photoURL
                }).then(function() {
                    toast('<i class="material-icons">build</i>', 1000, 'rounded green lighten-1 amber-text');
                }, function(error) {
                    toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                });
                if (auth.currentUser.emailVerified) {
                    myModel.save().then(() => {
                        toast('<i class="material-icons">build</i>', 1000, 'rounded green lighten-1 amber-text');
                        this.transitionToRoute('/users/' + auth.currentUser.uid + '/edit');
                    }, (error) => {
                        toast(error, 5000, 'rounded red lighten-1 black-text');
                    });
                } else {
                    toast("Debes validar el correo antes de modificar nada", 4000, 'rounded red lighten-5 black-text');
                }
            }
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

        sendPasswordReset() {
            toast('<i class="material-icons">send</i>', 3000, 'rounded amber darken-5 white-text');
            var email = this.model.get('email');
            const auth = this.get('firebaseApp').auth();
            auth.sendPasswordResetEmail(email).then(function() {
                toast('<i class="material-icons">send</i>enviado a ' + email, 3000, 'rounded green darken-5 white-text');
            }).catch(function(error) {
                if (error.code === 'auth/invalid-email') {
                    toast("Correo no válido", 5000, 'rounded red lighten-1 black-text');
                } else if (error.code === 'auth/user-not-found') {
                    toast("Correo no encontrado", 5000, 'rounded red lighten-1 black-text');
                } else {
                    toast(error.code, 5000, 'rounded red lighten-1 black-text');
                    toast(error.message, 5000, 'rounded red lighten-1 black-text');
                }
            });
        },

        sendEmailVerification() {
            toast('<i class="material-icons">drafts</i>', 1000, 'rounded green darken-5 white-text');
            toast('<i class="material-icons">content_copy</i>', 2000, 'rounded green darken-5 white-text');
            toast('<i class="material-icons">pets</i>', 1000, 'rounded green darken-5 white-text');
            toast('<i class="material-icons">email</i>', 3000, 'rounded green darken-5 white-text');
            const auth = this.get('firebaseApp').auth();
            auth.currentUser.sendEmailVerification().then(function() {
                toast('<i class="material-icons">send</i>', 3000, 'rounded green darken-5 white-text');
            });
        },

        needUpgrade() {
            toast('<i class="material-icons">build</i>', 1000, 'rounded green lighten-1 amber-text');
            const auth = this.get('firebaseApp').auth();
            if (auth.currentUser) {
                if (auth.currentUser.emailVerified && this.model.get('emailVerified')) {
                    this.model.save().then(() => {
                        toast('<i class="material-icons">build</i>', 3000, 'rounded green lighten-1 white-text');
                        this.transitionToRoute('/users/' + auth.currentUser.uid + '/edit');
                    }, (error) => {
                        toast(error, 5000, 'rounded red lighten-1 black-text');
                    });
                }
            }
        },

        signOut() {
            toast('Cerrando sesión', 1000, 'rounded #ffca28 amber lighten-1 black-text');
            //Ember.$.delay(3000);
            this.get('session').close();
            this.transitionToRoute('/');
            toast('Se ha cerrando sesión', 2000, 'rounded red black-text');
        }
    }
});