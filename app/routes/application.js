import Ember from 'ember';
import Materialize from 'materialize';

const { inject: { service } } = Ember;
const { toast } = Materialize;

export default Ember.Route.extend({

    moment: service(),

    beforeModel() {
        //toast('hein', 5000, 'rounded #ffca28 amber lighten-1 black-text');
        if (this.get('session')) {
            /*            this.get('session').fetch('password').catch((error) => {
                            toast(error, 5000, 'rounded #ffca28 amber lighten-1 black-text');
                        });*/
            //toast(this.get('session'), 5000, 'rounded #ffca28 amber lighten-1 black-text');
        }
        this.get('moment').setLocale('es');
        this.get('moment').setTimeZone('Europe/Madrid');
        if (this.get('session.isAuthenticated')) {
            toast(this.get('session.currentUser.uid'));
            this.transitionTo('/users/' + this.get('session.currentUser.uid') + '/edit');
        }
    },
    model() {
        return Ember.RSVP.hash({
            users: this.store.findAll('user').then(results => results.sortBy('email')),
        });
    },

    setupController(controller, model) {
        controller.set('users', model.users);
    },

    actions: {
        accessDenied() {
            this.transitionTo('/');
        },
    },

});