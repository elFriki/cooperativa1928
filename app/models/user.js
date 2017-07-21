import DS from 'ember-data';

export default DS.Model.extend({
  displayName: DS.attr('string'),
  uid: DS.attr('string'),
  email: DS.attr('string'),
  phone: DS.attr('string'),
  phoneVerified: DS.attr('boolean'),
  emailVerified: DS.attr('boolean'),
  status: DS.attr('string'),
  home: DS.attr('string'),
  isAdmin: DS.attr('boolean'),
  isOwner: DS.attr('boolean'),
  isActive: DS.attr('boolean')
});