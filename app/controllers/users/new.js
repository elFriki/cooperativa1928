import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Controller.extend({

    firebaseApp: Ember.inject.service(),

    actions: {
        info(param) {
            toast(param, 5000, 'rounded #ffca28 amber lighten-1 black-text');
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
        }
    }
});