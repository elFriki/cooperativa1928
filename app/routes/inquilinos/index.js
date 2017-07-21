import Ember from 'ember';

export default Ember.Route.extend({

    model() {
        return Ember.RSVP.hash({
            inquilinos: this.store.findAll('inquilino').then(results => results.sortBy('name')),
        });
    },

    setupController(controller, model) {
        controller.set('inquilinos', model.inquilinos);
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