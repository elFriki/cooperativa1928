import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Controller.extend({

    moment: Ember.inject.service(),


    actions: {
        info(param) {
            Materialize.toast(param, 5000, 'rounded transparent black-text');
        },

        signOut() {
            Materialize.toast('Cerrando sesión', 1000, 'rounded');
            this.get('session').close();
            this.transitionToRoute('/index');
            Materialize.toast('Se ha cerrando sesión', 2000, 'rounded');
        }
    }
});