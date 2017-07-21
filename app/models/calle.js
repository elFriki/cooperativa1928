import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  casas: DS.hasMany('casas', { async: true })
});