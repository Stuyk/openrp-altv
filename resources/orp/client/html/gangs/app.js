const { createElement, render, Component } = preact;
const h = createElement;

const pages = ['Members', 'Upgrades', 'Settings'];

const blipColors = {
    1: 'e13b3b',
    2: '79ce79',
    3: '64b8e6',
    4: 'f0f0f0',
    5: 'efca57',
    6: 'c55758',
    7: 'a074b3',
    8: 'ff81c8',
    9: 'f6a480',
    10: 'b6968b',
    11: '91cfaa',
    12: '78adb3',
    13: 'd5d3e8',
    14: '95859f',
    15: '70c7c1',
    16: 'd8c59e',
    17: 'eb9358',
    18: '9dccea',
    19: 'b6698d',
    20: '95927f',
    21: 'aa7a67',
    22: 'b4abac',
    23: 'e892a0',
    24: 'bfd863',
    25: '17815d',
    26: '80c7ff',
    27: 'ae44e6',
    28: 'd0ac18',
    29: '4e69b1',
    30: '34a9bc',
    31: 'bca183',
    32: 'cde2ff',
    33: 'f0f09b',
    34: 'ed91a4',
    35: 'f98f8f',
    36: 'fdf0aa',
    37: 'f1f1f1',
    38: '3776bd',
    39: '9f9f9f',
    40: '545454',
    41: 'f29e9e',
    42: '6db8d7',
    43: 'b0eeaf',
    44: 'fea75e',
    45: 'f0f0f0',
    46: 'ebef28',
    47: 'ff9a18',
    48: 'f644a4',
    49: 'e03b3b',
    50: '8a6de2',
    51: 'ff8a5c',
    52: '426d42',
    53: 'b3ddf3',
    54: '3a647a',
    55: 'a0a0a0',
    56: '847232',
    57: '65b9e7',
    58: '4c4276',
    59: 'e13b3b',
    60: 'f0cb58',
    61: 'cd3e98',
    62: 'cfcfcf',
    63: '286b9f',
    64: 'd77a1a',
    65: '8e8393',
    66: 'f0ca57',
    67: '64b8e6',
    68: '65b9e7',
    69: '78cd78',
    70: 'efca57',
    71: 'f0cb58',
    72: '000000',
    73: 'f0cb58',
    74: '64b9e7',
    75: 'e13b3b',
    76: '782424',
    77: '65b9e7',
    78: '39647a',
    79: 'e13b3b',
    80: '65b9e7',
    81: 'f2a40c',
    82: 'a4ccaa',
    83: 'a854f2',
    84: '65b8e6',
    85: '000000'
};

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            page: -1,
            myrank: 0,
            myid: 0
        };

        this.readyBind = this.ready.bind(this);
        this.setRankBind = this.setRank.bind(this);
        this.keyUpBind = this.keyUp.bind(this);
        this.typing = false;
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('gang:Ready', this.readyBind);
            alt.on('gang:SetRank', this.setRankBind);
            setTimeout(() => {
                alt.emit('gang:Ready');
            }, 500);
        } else {
            const members = [];
            for (let i = 0; i < 25; i++) {
                const member = {
                    id: Math.floor(Math.random() * 50000),
                    rank: 0,
                    name: `Member_${Math.random() * 50}`
                };
                members.push(member);
            }

            members.push({
                id: 9,
                rank: 3,
                name: 'Joe_Blow'
            });

            this.ready(
                JSON.stringify({
                    id: 9,
                    creation: '1573488563285',
                    name: 'Nerds',
                    members: JSON.stringify(members),
                    ranks: '["Youngens","Street Soldiers","High Council","Shotcaller"]',
                    turfs: '[69,82,154,72,81]'
                })
            );
        }

        window.addEventListener('keyup', this.keyUpBind);
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('gang:Ready', this.readyBind);
        }

        window.removeEventListener('keyup', this.keyUpBind);
    }

    markAsTyping() {
        this.typing = true;
    }

    unmarkAsTyping() {
        this.typing = false;
    }

    ready(data) {
        const newData = JSON.parse(data);
        let members = JSON.parse(newData.members);
        members = members
            .sort((a, b) => {
                return a.rank - b.rank;
            })
            .reverse();

        let refinedData = {
            id: newData.id,
            creation: newData.creation,
            name: newData.name,
            members,
            ranks: JSON.parse(newData.ranks),
            turfs: JSON.parse(newData.turfs),
            page: 0
        };
        this.setState(refinedData);
    }

    keyUp(e) {
        if (this.typing) return;
        if ('alt' in window) {
            if (e.key === 'Escape') {
                alt.emit('gang:Close');
            }

            if (e.key.toLowerCase() === 'u') {
                alt.emit('gang:Close');
            }
        }
    }

    setRank(rank, id) {
        this.setState({ myrank: rank, myid: id });
    }

    navigate(e) {
        const page = parseInt(e.target.id);
        this.setState({ page });
    }

    changeGangName(e) {
        if (e.key !== 'Enter') return;

        const value = e.target.value;
        if (value.length <= 3) return;

        this.setState({ name: value });

        if ('alt' in window) {
            alt.emit('gang:ChangeGangName', value);
        } else {
            console.log(value);
        }
    }

    changeRankName(e) {
        if (e.key !== 'Enter') return;

        const name = e.target.value;
        const id = parseInt(e.target.id);

        if (!name || name.length <= 3) return;

        const ranks = [...this.state.ranks];
        ranks[id] = name;
        this.setState({ ranks });

        if ('alt' in window) {
            alt.emit('gang:ChangeRankName', id, name);
        } else {
            console.log(`Changed Rank ${id} to ${name}`);
        }
    }

    changeOwnership(e) {
        if (e.key !== 'Enter') return;

        const memberID = parseInt(e.target.value);
        if (memberID <= 0) return;
        if (this.state.members.findIndex(member => member.id === memberID) <= -1) return;

        this.setState({ id: memberID });
        if ('alt' in window) {
            alt.emit('gang:ChangeOwnership', memberID);
        } else {
            console.log(`Changed Ownership to ${memberID}`);
        }
    }

    rankUpMember(e) {
        const members = [...this.state.members];
        const index = members.findIndex(mem => mem.id === parseInt(e.target.id));
        if (index <= -1) return;
        members[index].rank += 1;
        if (members[index].rank > this.state.ranks.length - 1) {
            members[index].rank = this.state.ranks.length - 1;
        }
        this.setState({ members });

        if ('alt' in window) {
            alt.emit('gang:RankUp', members[index].id);
        } else {
            console.log('rankup');
        }
    }

    rankDownMember(e) {
        const members = [...this.state.members];
        const index = members.findIndex(mem => mem.id === parseInt(e.target.id));
        if (index <= -1) return;
        members[index].rank -= 1;
        if (members[index].rank <= 0) {
            members[index].rank = 0;
        }
        this.setState({ members });

        if ('alt' in window) {
            alt.emit('gang:RankDown', members[index].id);
        } else {
            console.log('rankdown');
        }
    }

    removeMember(e) {
        const members = [...this.state.members];
        const index = members.findIndex(mem => mem.id === parseInt(e.target.id));
        if (index <= -1) return;

        if ('alt' in window) {
            alt.emit('gang:Remove', members[index].id);
        } else {
            console.log('remove');
        }

        members.splice(index, 1);
        this.setState({ members });
    }

    leaveAsMember(e) {
        const members = [...this.state.members];
        const index = members.findIndex(mem => mem.id === parseInt(e.target.id));
        if (index <= -1) return;

        if ('alt' in window) {
            alt.emit('gang:LeaveAsMember', members[index].id);
            alt.emit('gang:Close');
        } else {
            console.log('Leaving');
        }

        members.splice(index, 1);
        this.setState({ members });
    }

    createGang(e) {
        if (e.key !== 'Enter') return;

        const name = e.target.value;
        if (!name) return;
        if (name.length <= 3) return;
        this.setState({ page: -2 });

        if ('alt' in window) {
            alt.emit('gang:Create', name);
        }
    }

    disband(e) {
        if (e.key !== 'Enter') return;

        const name = e.target.value.replace(' ', '');
        if (this.state.name.replace(' ', '') !== name) return;

        if ('alt' in window) {
            alt.emit('gang:Disband');
        } else {
            console.log('disbanded');
        }
    }

    renderNavigation() {
        const tabs = pages.map((page, index) => {
            if (index >= 1 && this.state.myrank <= 1) return;

            const isActive = index === this.state.page ? true : false;
            if (isActive) {
                return h(
                    'button',
                    { class: 'tab active', id: index, onclick: this.navigate.bind(this) },
                    page
                );
            }

            return h(
                'button',
                { class: 'tab', id: index, onclick: this.navigate.bind(this) },
                page
            );
        });

        return h('div', { class: 'navigation' }, tabs);
    }

    render() {
        return h(
            'div',
            { class: 'content' },
            h(this.renderNavigation.bind(this)),
            this.state.page === -2 && h('div', { class: 'page' }, 'Please Wait...'),
            this.state.page === -1 &&
                h(
                    'div',
                    { class: 'page' },
                    h(NewGang, {
                        data: this.state,
                        functions: {
                            createGang: this.createGang.bind(this),
                            markAsTyping: this.markAsTyping.bind(this),
                            unmarkAsTyping: this.unmarkAsTyping.bind(this)
                        }
                    })
                ),
            this.state.page === 0 &&
                h(
                    'div',
                    { class: 'page' },
                    h(Members, {
                        data: this.state,
                        functions: {
                            markAsTyping: this.markAsTyping.bind(this),
                            unmarkAsTyping: this.unmarkAsTyping.bind(this),
                            rankUpMember: this.rankUpMember.bind(this),
                            rankDownMember: this.rankDownMember.bind(this),
                            removeMember: this.removeMember.bind(this),
                            leaveAsMember: this.leaveAsMember.bind(this)
                        }
                    })
                ),
            this.state.page === 1 &&
                h(
                    'div',
                    { class: 'page' },
                    h(Upgrades, { data: this.state, functions: {} })
                ),
            this.state.page === 2 &&
                h(
                    'div',
                    { class: 'page' },
                    h(Settings, {
                        data: this.state,
                        functions: {
                            markAsTyping: this.markAsTyping.bind(this),
                            unmarkAsTyping: this.unmarkAsTyping.bind(this),
                            changeGangName: this.changeGangName.bind(this),
                            changeRankName: this.changeRankName.bind(this),
                            changeOwnership: this.changeOwnership.bind(this),
                            disband: this.disband.bind(this)
                        }
                    })
                ),
            this.state.name && h('div', { class: 'gang-name' }, this.state.name)
        );
    }
}

class NewGang extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderNewGang({ data, functions }) {
        return h(
            'div',
            { class: 'newgangs' },
            h(
                'div',
                { class: 'gang' },
                h('div', { class: 'gang-label' }, 'New Gang'),
                h(
                    'input',
                    {
                        type: 'text',
                        onfocusin: functions.markAsTyping.bind(this),
                        onfocusout: functions.unmarkAsTyping.bind(this),
                        onkeydown: functions.createGang.bind(this),
                        placeholder: 'Type our gang name here...'
                    },
                    'New Gang'
                )
            )
        );
    }

    render(props) {
        return h(this.renderNewGang.bind(this), {
            data: props.data,
            functions: props.functions
        });
    }
}

class Members extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search: ''
        };
    }

    search(e) {
        const value = e.target.value;
        this.setState({ search: value });
    }

    clearFilters() {
        this.setState({ search: '' });
    }

    renderMembers({ data, functions }) {
        if (!data.id) return;
        // Filter
        let filteredMembers =
            this.state.search !== ''
                ? data.members.filter(member => member.name.includes(this.state.search))
                : data.members;

        // Sort by Rank
        filteredMembers = filteredMembers
            .sort((a, b) => {
                return a.rank - b.rank;
            })
            .reverse();

        const renderData = filteredMembers.map(member => {
            const isRankHigher = data.myrank > member.rank ? true : false;
            const isOfficer = data.myrank >= 2 ? true : false;
            const isOwner = data.myid === data.id ? true : false;
            const isSelf = data.myid === member.id;

            return h(
                'div',
                { class: 'member' },
                h('div', { class: 'id space' }, member.id),
                h(
                    'div',
                    { class: 'name space' },
                    data.id === member.id ? `${member.name} (Owner)` : member.name
                ),
                h(
                    'div',
                    { class: 'rank space' },
                    `${member.rank} - ${data.ranks[member.rank]}`
                ),
                h(
                    'div',
                    { class: 'controls space' },
                    isRankHigher &&
                        isOfficer &&
                        h(
                            'button',
                            {
                                class: 'rankup',
                                id: member.id,
                                onclick: functions.rankUpMember.bind(this)
                            },
                            'Rank Up'
                        ),
                    (isRankHigher && isOfficer) ||
                        (isOwner &&
                            !isSelf &&
                            h(
                                'button',
                                {
                                    class: 'rankdown',
                                    id: member.id,
                                    onclick: functions.rankDownMember.bind(this)
                                },
                                'Rank Down'
                            )),
                    isRankHigher &&
                        isOwner &&
                        h(
                            'button',
                            {
                                class: 'remove',
                                id: member.id,
                                onclick: functions.removeMember.bind(this)
                            },
                            'Kick'
                        ),
                    data.myid === member.id &&
                        !isOwner &&
                        h(
                            'button',
                            {
                                class: 'remove',
                                id: member.id,
                                onclick: functions.leaveAsMember.bind(this)
                            },
                            'Leave Gang'
                        )
                )
            );
        });

        renderData.unshift(
            h(
                'div',
                { class: 'categories' },
                h('div', { class: 'label' }, 'ID'),
                h('div', { class: 'label' }, 'NAME'),
                h('div', { class: 'label' }, 'RANK'),
                data.myrank >= 2 && h('div', { class: 'label controls-cat' }, 'CONTROLS')
            )
        );

        renderData.unshift(
            h(
                'div',
                { class: 'searchbox' },
                h('input', {
                    type: 'text',
                    placeholder: 'Search for member...',
                    onchange: this.search.bind(this),
                    onfocusin: functions.markAsTyping,
                    onfocusout: functions.unmarkAsTyping
                }),
                h(
                    'button',
                    {
                        onclick: this.clearFilters.bind(this)
                    },
                    'Clear Filter'
                )
            )
        );

        return h('div', { class: 'members' }, renderData);
    }

    render(props) {
        return h(this.renderMembers.bind(this), {
            data: props.data,
            functions: props.functions
        });
    }
}

class Upgrades extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    componentWillUnmount() {}

    render() {
        return h('div', {}, 'Upgrades');
    }
}

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderSettings({ data, functions }) {
        const renderData = [];

        // changeGangName
        renderData.push(
            h(
                'div',
                { class: 'option' },
                h('div', { class: 'label' }, 'Gang Name'),
                h('input', {
                    type: 'text',
                    placeholder: `Type here and hit enter to change name.`,
                    onkeydown: functions.changeGangName.bind(this),
                    onfocusin: functions.markAsTyping,
                    onfocusout: functions.unmarkAsTyping
                })
            )
        );

        // changeRankName
        for (let i = 0; i < 4; i++) {
            let rankDesc = `Rank ${i}`;

            if (i === 0) {
                rankDesc += ' - New Member';
            }

            if (i === 1) {
                rankDesc += ' - Can Recruit';
            }

            if (i === 2) {
                rankDesc += ' - Can Recruit';
            }

            if (i === 3) {
                rankDesc += ' - Owner / Leader';
            }

            renderData.push(
                h(
                    'div',
                    { class: 'option' },
                    h('div', { class: 'label' }, rankDesc),
                    h('input', {
                        type: 'text',
                        placeholder: `${data.ranks[i]} - Type here and hit enter to change name.`,
                        id: i,
                        onkeydown: functions.changeRankName.bind(this),
                        onfocusin: functions.markAsTyping,
                        onfocusout: functions.unmarkAsTyping
                    })
                )
            );
        }

        // changeOwnership
        if (data.id === data.myid && data.myrank >= 3) {
            renderData.push(
                h(
                    'div',
                    { class: 'option' },
                    h('div', { class: 'label' }, '[CAREFUL] Set Ownership'),
                    h('input', {
                        min: 0,
                        type: 'number',
                        placeholder: `Type here and hit enter to change ownership of gang.`,
                        onkeydown: functions.changeOwnership.bind(this),
                        onfocusin: functions.markAsTyping,
                        onfocusout: functions.unmarkAsTyping
                    })
                )
            );

            renderData.push(
                h(
                    'div',
                    { class: 'option' },
                    h('div', { class: 'label' }, 'Disband Gang'),
                    h('input', {
                        type: 'text',
                        placeholder: `Type the exact gang name here; and press enter. Delete text if change your mind.`,
                        onkeydown: functions.disband.bind(this),
                        onfocusin: functions.markAsTyping,
                        onfocusout: functions.unmarkAsTyping
                    })
                )
            );
        }

        return h('div', { class: 'settings' }, renderData);
    }

    render(props) {
        return h(this.renderSettings.bind(this), {
            data: props.data,
            functions: props.functions
        });
    }
}

render(h(App), document.querySelector('#render'));
