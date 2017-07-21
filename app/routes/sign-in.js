import Ember from 'ember';

export default Ember.Route.extend({

    beforeModel() {
        if (this.get('session.isAuthenticated')) {
            this.transitionTo('welcome');
        }
    },
    
    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('team')),
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
    }
});