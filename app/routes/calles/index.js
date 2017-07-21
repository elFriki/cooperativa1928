import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            calles: this.store.findAll('calle').then(results => results.sortBy('name')),
        });
    },

    setupController(controller, model) {
        controller.set('calles', model.calles);
    },

    actions: {

        deleteModel(myModel) {
            let literal = '¿Seguro?';
            let confirmation = confirm(literal);

            if (confirmation) {
                myModel.destroyRecord().then(() => this.transitionTo('index'));
            }
        }
    }

});