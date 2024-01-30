let abilityDict = {
  "str": { Name: "Force"},
  "dex": { Name: "Dextérité" },
  "con": { Name: "Constitution"},
  "int": { Name: "Intelligence"},
  "wis": { Name: "Sagesse"},
  "cha": { Name: "Charisme"}
}

class WoundConfig extends FormApplication {
  constructor(actor, ability, isWounded, daysToHeal) {
    super();
    this.actor = actor;
    this.ability = ability;
    this.isWounded = isWounded;
    this.daysToHeal = daysToHeal;
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
  
    const overrides = {
      height: 'auto',
      id: 'wound-conf',
      template: "modules/RoleNPlay_fvtt_5e_extra_rules/templates/wounds.hbs",
      title: 'Configuration des blessures',
      closeOnSubmit: false, // do not close when submitted
      submitOnChange: true, // submit when any input changes
    };
  
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    
    return mergedOptions;
  }

  getData() {
    // Send data to the template
    return {
      ability: abilityDict[this.ability].Name,
      isWounded: this.isWounded,
      daysToHeal: this.daysToHeal,
    };
  }

  async _updateObject(event, formData) {
    const expandedData = foundry.utils.expandObject(formData);
    
    if(event["type"]=='submit'){
      this.actor.update({
        [`flags.wounds5e.${this.ability}.isWounded`]: expandedData['daysToHeal'] == 0 ? false : expandedData['isWounded'],
        [`flags.wounds5e.${this.ability}.daysToHeal`]: expandedData['daysToHeal'],
        [`flags.midi-qol.disadvantage.ability.check.${this.ability}`]: expandedData['isWounded'] ? 1 : 0
      })
      
      this.actor.update({
      })
      
      this.close();
    }
  
  }
}

Hooks.on('renderActorSheet', (actorSheet, html, data) => {
  actor = actorSheet.actor
  console.log(actor)
  if(actor.type=='character'){
    const abilityItem = html.find(`[class="ability "]`);

    abilityItem.append(
      "<a class='wound-button' data-action='wound'><i class='fas fa-heartbeat'></i></a>"
    );

    html.on('click', '.wound-button', (event) => {      
      let ability =  event.target.closest("li.ability").dataset.ability;
      let flagIsWounded = 'flags.wounds5e.' + ability + '.isWounded';
      let flagDaysToHeal = 'flags.wounds5e.' + ability + '.daysToHeal';

      let flagVal = getProperty(actor, flagDaysToHeal);

      console.log(flagVal);
      
      new WoundConfig(actor, ability, getProperty(actor, flagIsWounded), getProperty(actor, flagDaysToHeal)).render(true)
    });
  }
});


Hooks.on('preCreateActor', (actor, data, options, userId) => {
  if (actor.type === 'character') {
    actor.updateSource({'flags.wounds5e': {
      'str.isWounded' : false,
      'str.daysToHeal' : 0,
      'dex.isWounded' : false,
      'dex.daysToHeal' : 0,
      'con.isWounded' : false,
      'con.daysToHeal' : 0,
      'int.isWounded' : false,
      'int.daysToHeal' : 0,
      'wis.isWounded' : false,
      'wis.daysToHeal' : 0,
      'cha.isWounded' : false,
      'cha.daysToHeal' : 0}
    });
  }
})

Hooks.on('dnd5e.preRestCompleted', (actor, data) => {
  console.log(data["newDay"]);
})

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});
