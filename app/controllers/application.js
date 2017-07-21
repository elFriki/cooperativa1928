import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Controller.extend({

    moment: Ember.inject.service(),


    actions: {
        info(param) {
            Materialize.toast(param, 5000, 'rounded transparent black-text');
        },

        signOut() {
            this.get('session').close();
            this.transitionToRoute('/');
        }
    }
});