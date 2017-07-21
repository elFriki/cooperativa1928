import Ember from 'ember';
//import Materialize from 'materialize';

export default Ember.Route.extend({
    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('email')),
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
    }

});