const { createElement, render, Component } = preact;
const h = createElement;

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inventory: [],
            recipes: [],
            craftingLevel: 1,
            cookingLevel: 1,
            search: ''
        };

        this.typing = false;
        this.closeBind = this.close.bind(this);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('craft:AddRecipe', this.addRecipe.bind(this));
            alt.on('craft:CraftingLevel', this.setCraftingLevel.bind(this));
            alt.on('craft:SetInventory', this.setInventory.bind(this));
            alt.on('craft:CookingLevel', this.setCookingLevel.bind(this));
            alt.emit('craft:Ready');
        } else {
            this.addRecipe('fishandchips', {
                name: 'Fish and Chips',
                key: 'fishandchips',
                requirements: [
                    { key: 'cooking', level: 1 },
                    { key: 'potato', amount: 3 },
                    { key: 'rawfish', amount: 1 },
                    { key: 'rawfish', amount: 1 },
                    { key: 'rawfish', amount: 1 },
                    { key: 'rawfish', amount: 1 },
                    { key: 'rawfish', amount: 1 },
                    { key: 'rawfish', amount: 1 }
                ]
            });

            this.addRecipe('knife', {
                name: 'Knife',
                key: 'weapon',
                requirements: [
                    { key: 'crafting', level: 1 },
                    { key: 'refinedmetal', amount: 25 },
                    { key: 'refinedwood', amount: 5 }
                ]
            });

            for (let i = 0; i < 35; i++) {
                this.addRecipe('bat', {
                    name: 'Bat',
                    key: 'weapon',
                    requirements: [
                        { key: 'crafting', level: 5 },
                        { key: 'refinedmetal', amount: 900000 }
                    ]
                });
            }

            const json =
                '[{"name":"Refined Metal","base":"refined","key":"refinedmetal","props":{},"quantity":500,"icon":"metal","hash":"127e8a092afa3b6384b74ab998e0ac7bc9ff99d5fad459b444526be8b0079662"},{"name":"Refined Wood","base":"refined","key":"refinedwood","props":{},"quantity":500,"icon":"planks","hash":"127e8a092afa3b5e84b74ab998e0ac7bc9ff99d5fad459b444526be8b0079662"},{"name":"Raw Shrimp","base":"rawfish","key":"rawfish","props":{},"quantity":1,"icon":"planks","hash":"127e8a092afa3b5e84b74ab998e0ac7bc9ff99d5fad459b444526be8b0079662"},{"name":"Potato","base":"ingredient","key":"potato","props":{},"quantity":3,"icon":"planks","hash":"127e8a092afa3b5e84b74ab998e0ac7bc9ff99d5fad459b444526be8b0079662"}]';

            this.setInventory(json);
        }

        window.addEventListener('keyup', this.closeBind);
    }

    componentDidUnmount() {
        window.removeEventListener('keyup', this.closeBind);
    }

    addRecipe(key, recipe) {
        const recipes = [...this.state.recipes];
        recipes.push({ key, recipe });
        this.setState({ recipes });
    }

    setInventory(jsonData) {
        const inventoryParse = JSON.parse(jsonData);
        const inventory = inventoryParse.filter(
            item => item !== null && item !== undefined
        );
        this.setState({ inventory });
    }

    setCraftingLevel(level) {
        this.setState({ craftingLevel: level });
    }

    setCookingLevel(level) {
        this.setState({ cookingLevel: level });
    }

    close(e) {
        if (this.typing) return;
        if (e.key !== 'Escape') return;
        if ('alt' in window) {
            alt.emit('craft:Close');
        } else {
            console.log('Exiting');
        }
    }

    markAsTyping() {
        this.typing = true;
    }

    unmarkAsTyping() {
        this.typing = false;
    }

    clearSearch() {
        this.setState({ search: '' });
    }

    search(e) {
        if (e.key !== 'Enter') return;
        const search = e.target.value ? e.target.value.toLowerCase() : '';
        this.setState({ search });
    }

    craft(e) {
        if (!e.target.id) return;
        if ('alt' in window) {
            alt.emit('craft:CraftItem', e.target.id);
        } else {
            console.log(e.target.id);
        }
    }

    renderSearchBox() {
        return h(
            'div',
            { class: 'searchbox' },
            h('input', {
                type: 'text',
                placeholder: 'Search for recipe by name...',
                onkeyup: this.search.bind(this),
                onfocusin: this.markAsTyping.bind(this),
                onfocusout: this.unmarkAsTyping.bind(this)
            }),
            h('button', { onclick: this.clearSearch.bind(this) }, 'Clear Filter')
        );
    }

    toggleCategory(e) {
        const category = e.target.id;
        const toggle = this.state[category] ? false : true;
        this.setState({ [category]: toggle });
    }

    renderRecipes() {
        const renderData = [];
        const totals = {};
        this.state.inventory.forEach(item => {
            if (!item) return;
            if (!totals[item.key]) {
                totals[item.key] = item.quantity;
            } else {
                totals[item.key] = totals[item.key] + item.quantity;
            }
        });

        const recipes = [];
        this.state.recipes.forEach(recipeData => {
            const requirements = recipeData.recipe.requirements;
            if (!recipeData.recipe.name.toLowerCase().includes(this.state.search)) {
                return;
            }

            recipeData.disabled = true;

            for (let i = 0; i < requirements.length; i++) {
                if (requirements[i].key === 'crafting') {
                    if (this.state.craftingLevel < requirements[i].level) {
                        recipes.push(recipeData);
                        return;
                    } else {
                        continue;
                    }
                }

                if (requirements[i].key === 'cooking') {
                    if (this.state.cookingLevel < requirements[i].level) {
                        recipes.push(recipeData);
                        return;
                    } else {
                        continue;
                    }
                }

                if (!totals[requirements[i].key]) {
                    recipes.push(recipeData);
                    return;
                }

                if (requirements[i].amount > totals[requirements[i].key]) {
                    recipes.push(recipeData);
                    return;
                }
            }

            recipeData.disabled = false;
            recipes.push(recipeData);
        });

        recipes.sort((a, b) => {
            return a.recipe.requirements[0].level - b.recipe.requirements[0].level;
        });

        const recipeRender = recipes.map(recipeData => {
            const requirements = recipeData.recipe.requirements.map(
                (requirement, index) => {
                    const isEven = index === 0 || index % 2 === 0 ? true : false;
                    if (requirement.key !== 'crafting' && requirement.key !== 'cooking') {
                        return h(
                            'div',
                            { class: isEven ? 'requirement offbeat' : 'requirement' },
                            h('div', { class: 'key' }, requirement.key),
                            h('div', { class: 'amount' }, `x${requirement.amount}`)
                        );
                    }
                }
            );

            return h(
                'div',
                { class: 'recipe' },
                h(
                    'div',
                    { class: 'header' },
                    this.state[recipeData.name] &&
                        h(
                            'button',
                            {
                                class: 'toggle',
                                id: recipeData.key,
                                onclick: this.toggleCategory.bind(this)
                            },
                            '-'
                        ),
                    !this.state[recipeData.name] &&
                        h(
                            'button',
                            {
                                class: 'toggle',
                                id: recipeData.key,
                                onclick: this.toggleCategory.bind(this)
                            },
                            '+'
                        ),
                    h(
                        'div',
                        { class: recipeData.disabled ? 'level disabled' : 'level' },
                        `${recipeData.recipe.requirements[0].level}`
                    ),
                    h(
                        'div',
                        { class: recipeData.disabled ? 'title disabled' : 'title' },
                        `${recipeData.recipe.name}`
                    ),
                    !recipeData.disabled &&
                        h(
                            'button',
                            {
                                id: recipeData.key,
                                onclick: this.craft.bind(this)
                            },
                            'Craft'
                        ),
                    recipeData.disabled &&
                        h('button', { class: 'disabled', id: recipeData.key }, 'Craft')
                ),
                this.state[recipeData.key] &&
                    h(
                        'div',
                        {
                            class: recipeData.disabled
                                ? 'requirements disabled'
                                : 'requirements'
                        },
                        requirements
                    )
            );
        });

        renderData.push(h('div', { class: 'recipes' }, recipeRender));
        return h('div', { class: 'page' }, renderData);
    }

    render() {
        return h(
            'div',
            { class: 'panel' },
            h(this.renderSearchBox.bind(this)),
            h(this.renderRecipes.bind(this))
        );
    }
}

render(h(App), document.querySelector('#render'));
