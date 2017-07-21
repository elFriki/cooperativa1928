import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('email')),
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
    },

    actions: {

        deleteUser(user) {
            let literal = '¿Seguro que quieres eliminar al usuario ' + user.get('email') + '?';
            let confirmation = confirm(literal);

            if (confirmation) {
                user.destroyRecord().then(() => this.transitionTo('index'));
            }
        },
        deleteBBDDUser() {
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
        }
    }

});