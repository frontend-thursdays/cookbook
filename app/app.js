let components = [{id: 5}];
const componentsForm = document.getElementById('components');
const newComponentForm = document.getElementById('new-component');

function add(target) {
    const parent = target.parentNode;
    const component = {
        id:       (new Date()).getTime(),
        name:     parent.querySelector('[name]').value,
        quantity: parseFloat(parent.querySelector('[quantity]').value),
        unit:     parent.querySelector('[unit]').value
    };

    const validator = new Validator(component);
    const valid = validator.validate(
        {
            id:       [Validator.required, Validator.number, Validator.unique(components)],
            name:     [Validator.required, Validator.string, Validator.max(32)],
            quantity: [Validator.required, Validator.number, Validator.min(1)],
            unit:     [Validator.required, Validator.string, Validator.exists(['g', 'l', 'pcs'])]
        },
        errors => errors.length && console.error(errors)
    );

    if (valid) {
        components.push(component);
        componentsForm.innerHTML += build(component);
        clear();
    }
}

function clear() {
    newComponentForm.querySelector('[name]').value = '';
    newComponentForm.querySelector('[quantity]').value = '1';
    newComponentForm.querySelector('[unit]').value = 'g';
}

function remove() {
    console.log('remove');
}

// Builder
const template = `<div class="component" id="{id}">
        <input name type="text" placeholder="name" maxlength="32" value="{name}"/>
        <input quantity type="number" placeholder="Ilość" min="1" step="1" value="{quantity}"/>
        <select unit value="{unit}">
            <option value="g">g</option>
            <option value="l">l</option>
            <option value="pcs">pcs</option>
        </select>
        <button onclick="{buttonAction}(this)">{buttonText}</button>
    </div>`;

function build({id = 'add-component', name = '', quantity = 1, unit = 'g'} = {}) {
    const [buttonText, buttonAction] = id === 'add-component'
        ? ['+', 'add']
        : ['-', 'remove'];
    return template.replace(/{id}/g, id)
        .replace(/{name}/g, name)
        .replace(/{quantity}/g, quantity.toString())
        .replace(/{unit}/g, unit)
        .replace(/{buttonText}/g, buttonText)
        .replace(/{buttonAction}/g, buttonAction);
}


newComponentForm.innerHTML = build();