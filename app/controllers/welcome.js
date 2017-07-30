import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Controller.extend({

    firebaseApp: Ember.inject.service(),

    user: Ember.computed('users@each', function() {
        let controller = this;
        const auth = controller.get('firebaseApp').auth();
        let current = this.get('users').filterBy('id', auth.currentUser.uid);
        return current;
        //return auth.currentUser;
    }).property('user'),

    isCurrent: Ember.computed('user', function() {
        let controller = this;
        const auth = controller.get('firebaseApp').auth();
        toast(auth.currentUser.email);
        //console.log(auth.currentUser.email);
        return false;
    }),

    displayName: Ember.computed('firebaseApp', function() {
        let controller = this;
        const auth = controller.get('firebaseApp').auth();
        return auth.currentUser.displayName;
    }),

    photoURL: Ember.computed('firebaseApp', function() {
        let controller = this;
        const auth = controller.get('firebaseApp').auth();
        return auth.currentUser.photoURL;
    }),

    actions: {
        info(param) {
            /*
                        let msg = '<i class="material-icons">info</i>';
                        msg += param;
                        msg += '<br><br><br><br><small>(desliza para que desaparezca)</small>';
                        Materialize.toast(msg, 5000, 'rounded transparent black-text');
            */
            toast(param, 5000, 'rounded #ffca28 amber lighten-1 black-text');

        },
        sendEmailVerification() {
            let controller = this;
            toast('Conectando...', 2000, 'rounded #ffca28 amber lighten-1 black-text');
            const auth = this.get('firebaseApp').auth();
            toast('Comprobando...', 2000, 'rounded #ffca28 amber lighten-1 black-text');
            auth.currentUser.sendEmailVerification()
                .then(() => {
                    toast('Email de verificación enviado', 4000, 'rounded #ffca28 amber lighten-1 black-text');
                    controller.set('confirmEmail', true);
                }, (error) => {
                    var msg = error.code + ": " + error.message;
                    toast(msg, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                });

        },
        basicUpdateUser() {
            let controller = this;
            toast("Actualizando...", 2000, 'rounded #ffca28 amber lighten-1 black-text');
            const auth = this.get('firebaseApp').auth();
            auth.currentUser.updateProfile({
                //                displayName: controller.get('displayName') || auth.currentUser.displayName,
                //                photoURL: controller.get('photoURL') || auth.currentUser.photoURL
                displayName: controller.get('displayName'),
                photoURL: controller.get('photoURL')
            }).then(function() {
                toast("Perfil actualizado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
            }, function(error) {
                toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
            });
        },
        deleteUser() {
            let controller = this;
            const auth = controller.get('firebaseApp').auth();
            toast("Eliminando..." + auth.currentUser.email, 2000, 'rounded #ffca28 amber lighten-1 black-text');
            let nombre = " " + auth.currentUser.displayName;
            toast(nombre, 5000, 'rounded #ffca28 amber lighten-1 black-text');
            if (confirm('Esta acción eliminará permanentemente a este usuario. ¿Seguro que quieres eliminarlo?')) {
                auth.currentUser.delete().
                then(() => {
                    toast("Eliminado", 5000, 'rounded #ffca28 amber lighten-1 black-text');
                    this.get('session').close();
                    this.transitionToRoute('/');
                }, (error) => {
                    if (error) {
                        if (error.code === 'auth/requires-recent-login') {
                            toast('Para realizar esta operación es necesario el inicio de sesión reciente', 10000, 'rounded #ffca28 amber lighten-1 black-text');
                        } else {
                            toast(error.code, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                            toast(error.message, 10000, 'rounded #ffca28 amber lighten-1 black-text');
                        }
                    }
                });
            } else {
                toast("Borrado cancelado");
            }
        },

        signOut() {
            toast('Cerrando sesión', 1000, 'rounded #ffca28 amber lighten-1 black-text');
            this.get('session').close();
            this.transitionToRoute('/');
            toast('Se ha cerrando sesión', 2000, 'rounded red black-text');
        }
    }
});