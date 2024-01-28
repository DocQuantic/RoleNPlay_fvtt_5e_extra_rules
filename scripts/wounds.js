let abilityDict = {
  "str": { Name: "Force"},
  "dex": { Name: "Dextérité" },
  "con": { Name: "Constitution"},
  "int": { Name: "Intelligence"},
  "wis": { Name: "Sagesse"},
  "cha": { Name: "Charisme"}
}

class WoundConfig extends FormApplication {
  constructor(ability) {
    super();
    this.ability = ability;
  }

  static get defaultOptions() {
    const defaults = super.defaultOptions;
  
    const overrides = {
      height: 'auto',
      id: 'wound-conf',
      template: "modules/RoleNPlay_fvtt_5e_extra_rules/templates/wounds.hbs",
      title: 'Configuration des blessures',
    };
  
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    
    return mergedOptions;
  }

  getData() {
    // Send data to the template
    return {
      ab: this.ability
    };
  }
}

Hooks.on('renderActorSheet', (actorSheet5eCharacter, html, data) => {
  const actor = actorSheet5eCharacter.actor;
  actor.setFlag('midi-qol', 'disadvantage.ability.check.dex', 0);


  if(actor.type=='character'){
    const abilityItem = html.find(`[class="ability "]`);

    abilityItem.append(
      "<a class='wound-button' data-action='wound'><i class='fas fa-heartbeat'></i></a>"
    );

    html.on('click', '.wound-button', (event) => {      
      let ab =  event.target.closest("li.ability").dataset.ability;
      
      new WoundConfig(abilityDict[ab].Name).render(true)
    });
  }
});

Hooks.on('preCreateActor', (doc, data, options, userId) => {
  if (doc.type === 'character') {
      doc.updateSource({'flags.midi-qol.disadvantage.ability.check.???': 0})
      doc.updateSource({'flags.wounds5e.dex.isWounded': 0})
  }
  console.log(doc)
})

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});
