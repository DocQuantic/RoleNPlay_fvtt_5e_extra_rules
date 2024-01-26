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
