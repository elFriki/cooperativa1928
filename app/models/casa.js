import DS from 'ember-data';

export default DS.Model.extend({
  calle: DS.belongsTo('calle'),
  numero: DS.attr('string'),
  propietarios: DS.hasMany('propietarios', { async: true }),
  inquilinos: DS.hasMany('inquilinos', { async: true })
});