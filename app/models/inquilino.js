import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  surname1: DS.attr('string'),
  surname2: DS.attr('string'),
  casa: DS.belongsTo('casa')
});