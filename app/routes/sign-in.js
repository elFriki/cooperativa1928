import Ember from 'ember';
import Materialize from 'materialize';

const { toast } = Materialize;

export default Ember.Route.extend({

    beforeModel() {
        if (this.get('session.isAuthenticated')) {
            toast(this.get('session.currentUser.uid'));
            this.transitionTo('/users/' + this.get('session.currentUser.uid') + '/edit');
        } else {
            //toast('Si no has entrado', 3000);
            //toast('nunca', 2000);
            //toast('pon un correo electrónico', 6000);
            //toast('y una clave', 5000);
        }
    },

    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('email')),
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
    }
});