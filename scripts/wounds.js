class WoundConfig extends FormApplication {
  static get defaultOptions() {
    const defaults = super.defaultOptions;
  
    const overrides = {
      height: 'auto',
      id: 'todo-list',
      template: "modules/RoleNPlay_fvtt_5e_extra_rules/templates/wounds.hbs",
      title: 'Blessure',
      ability: 'str'
    };
  
    const mergedOptions = foundry.utils.mergeObject(defaults, overrides);
    
    return mergedOptions;
  }

  getData() {
    // Send data to the template
    return {
      color: 'red',
    };
  }
}

Hooks.on('renderActorSheet', (actorSheet5eCharacter, html, data) => {
  const actor = actorSheet5eCharacter.actor;
  if(actor.type=='character'){
    const abilityItem = html.find(`[class="ability "]`);

    abilityItem.append(
      "<a class='wound-button' data-action='wound'><i class='fas fa-heartbeat'></i></a>"
    );

    html.on('click', '.wound-button', (event) => {
      actor.setFlag('midi-qol', 'flags.midi-qol.disadvantage.ability.check.dex', 0);
      let ab =  event.target.closest("li.ability").dataset.ability;
      console.log(ab);
    });
  }
});

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(ToDoList.ID);
});
