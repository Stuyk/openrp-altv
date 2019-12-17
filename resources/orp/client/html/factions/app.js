const { createElement, render, Component } = preact;
const h = createElement;

const permissions = {
    MIN: 0,
    RECRUIT: 1,
    KICK: 2,
    PROMOTE: 4,
    MAX: 7
};

const skillTreeExample = `{"0":{"gun":{"desc":"Gain access to gun running jobs with primary focus on the gun trade.","radio":{"description":"A faction designated chat.","requirement":250},"vehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"vehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"vehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"recon":{"description":"Able to see all faction members online.","requirement":3500},"vehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"vehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"vehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"aircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"warehouse":{"description":"Gain access to a faction warehouse for storing items.","requirement":38000},"main":{"description":"Access to gun running jobs.","requirement":1}},"drug":{"desc":"Gain access to drug running jobs with primary focus on the drug trade.","radio":{"description":"A faction designated chat.","requirement":250},"vehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"vehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"vehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"recon":{"description":"Able to see all faction members online.","requirement":3500},"vehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"vehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"vehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"aircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"warehouse":{"description":"Gain access to a faction warehouse for storing items.","requirement":38000},"main":{"description":"Access to drug running jobs.","requirement":1}}},"1":{"fbi":{"desc":"Your team will investigate murders and assist police with finding a killer.","recon":{"description":"Able to see all faction members online.","requirement":200},"radio":{"description":"A faction designated chat.","requirement":250},"fvehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"fvehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"fvehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"fvehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"fvehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"fvehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"faircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"paybonus0":{"description":"All members recieve a $5 paycheck bonus.","requirement":250000},"paybonus1":{"description":"All members recieve a $5 paycheck bonus.","requirement":500000},"main":{"description":"Investigate corpses information on a killer.","requirement":1}},"police":{"desc":"Your responsibility is to capture wanted criminals and maintain order.","recon":{"description":"Able to see all faction members online.","requirement":200},"radio":{"description":"A faction designated chat.","requirement":250},"fvehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"fvehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"fvehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"fvehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"fvehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"fvehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"faircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"paybonus0":{"description":"All members recieve a $5 paycheck bonus.","requirement":250000},"paybonus1":{"description":"All members recieve a $5 paycheck bonus.","requirement":500000},"main":{"description":"Standard police faction. Arrest other players. Access to MDC.","requirement":1}},"swat":{"desc":"Your factions responsibility is to help police neutralize heavily occupied turfs from gang activity.","recon":{"description":"Able to see all faction members online.","requirement":200},"radio":{"description":"A faction designated chat.","requirement":250},"fvehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"fvehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"fvehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"fvehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"fvehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"fvehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"faircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"paybonus0":{"description":"All members recieve a $5 paycheck bonus.","requirement":250000},"paybonus1":{"description":"All members recieve a $5 paycheck bonus.","requirement":500000},"main":{"description":"Access to heavy weaponry.","requirement":1}}},"2":{"firefighter":{"desc":"Put out fires and restore functionality to stores, jobs, etc.","recon":{"description":"Able to see all faction members online.","requirement":200},"radio":{"description":"A faction designated chat.","requirement":250},"fvehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"fvehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"fvehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"fvehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"fvehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"fvehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"faircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"paybonus0":{"description":"All members recieve a $5 paycheck bonus.","requirement":250000},"paybonus1":{"description":"All members recieve a $5 paycheck bonus.","requirement":500000},"main":{"description":"Retrieve locations of on-going fires.","requirement":1}},"ems":{"desc":"Retrieve downed civilians.","recon":{"description":"Able to see all faction members online.","requirement":200},"radio":{"description":"A faction designated chat.","requirement":250},"fvehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"fvehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"fvehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"fvehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"fvehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"fvehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"faircraft":{"description":"Unlock a faction aircraft.","requirement":32000},"paybonus0":{"description":"All members recieve a $5 paycheck bonus.","requirement":250000},"paybonus1":{"description":"All members recieve a $5 paycheck bonus.","requirement":500000},"main":{"description":"Retrieve and revive players. Recieve EMS calls.","requirement":1}}},"3":{"business":{"desc":"Start a business based on the item trading or any other service.","endpoint":{"description":"A special textable line for users talk to your business members.","requirement":100},"radio":{"description":"A faction designated chat.","requirement":250},"warehouse":{"description":"Gain access to a faction warehouse for storing items.","requirement":500},"vehicle0":{"description":"Unlock a faction vehicle.","requirement":500},"vehicle1":{"description":"Unlock a faction vehicle.","requirement":1000},"vehicle2":{"description":"Unlock a faction vehicle.","requirement":2000},"recon":{"description":"Able to see all faction members online.","requirement":3500},"vehicle3":{"description":"Unlock a faction vehicle.","requirement":4000},"vehicle4":{"description":"Unlock a faction vehicle.","requirement":8000},"vehicle5":{"description":"Unlock a faction vehicle.","requirement":16000},"aircraft":{"description":"Unlock a faction aircraft.","requirement":32000}}}}`;

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

function isFlagged(flags, flagValue) {
    if ((flags & flagValue) === flagValue) {
        return true;
    }
    return false;
}

// The main rendering function.
class App extends Component {
    constructor(props) {
        super(props);
        this.pages = {
            Board,
            Members,
            Ranks,
            Skills,
            Options
        };

        this.state = {
            subtype: '',
            classification: -1,
            skilltree: {},
            messages: [],
            ranks: [],
            members: [],
            page: -1,
            myrank: 0,
            myid: 9,
            notice:
                'Duis molestie eros non purus sollicitudin maximus. Vestibulum vitae justo non lacus venenatis suscipit. Quisque nec lacus venenatis, semper est sit amet, ultrices nisi. Ut vehicula dui ex, at mollis risus fermentum ac. Phasellus nec viverra leo, vel ultrices elit. Morbi a eleifend diam. Cras id leo id risus convallis egestas non eget libero. Phasellus nec eros libero. Ut commodo interdum felis nec elementum. Morbi convallis iaculis ante, in vulputate leo porta sit amet. Donec eu lectus sed dui imperdiet auctor et bibendum magna. Sed non finibus ex. Sed sodales tempor venenatis. Phasellus vel porttitor massa, a ultrices mauris. Aenean varius tempus turpis, eget molestie risus euismod id.'
        };

        this.typing = false;
        this.keyUpBind = this.keyUp.bind(this);
        setInterval(this.parseMessages.bind(this), 1000);
    }

    componentDidMount() {
        if ('alt' in window) {
            alt.on('faction:SetSkillTree', this.setSkillTree.bind(this));
            alt.on('faction:SetMyData', this.setMyData.bind(this));
            alt.on('faction:Ready', this.ready.bind(this));
            alt.on('faction:Error', this.factionError.bind(this));
            alt.on('faction:Success', this.factionSuccess.bind(this));
            alt.emit('faction:Ready');
        } else {
            const members = [];
            for (let i = 0; i < 25; i++) {
                const member = {
                    id: Math.floor(Math.random() * 50000),
                    rank: 1,
                    name: `Member_${(Math.random() * 50).toFixed(0)}`,
                    active: Date.now()
                };
                members.push(member);
            }

            members.push({
                id: 9,
                rank: 0,
                name: 'Joe_Blow',
                active: Date.now()
            });

            this.ready(
                JSON.stringify({
                    id: 9,
                    creation: '1573488563285',
                    name: 'Nerds',
                    members: JSON.stringify(members),
                    ranks:
                        '[{"name":"Owner", "flags": 7},{"name":"Recruit", "flags": 0}, {"name":"Less Recruit", "flags": 0}, {"name":"Lesser Recruit", "flags": 0}]',
                    turfs: '[69,82,154,72,81]',
                    skills: '[]',
                    classification: 0,
                    vehiclepoints: '[{"x": 0, "y": 0, "z": 0}, {"x": 0, "y": 0, "z": 0}]',
                    home: '{"x": 0, "y": 0, "z": 0}',
                    subtype: ''
                })
            );

            this.setSkillTree(skillTreeExample);

            /*
            for (let i = 0; i < 20; i++) {
                this.factionSuccess(`test ${i}`);
            }
            */
        }

        window.addEventListener('keyup', this.keyUpBind);
    }

    componentWillUnmount() {
        if ('alt' in window) {
            alt.off('faction:Ready', this.readyBind);
        }

        window.removeEventListener('keyup', this.keyUpBind);
    }

    setSkillTree(jsonData) {
        console.log(jsonData);

        this.setState({ skilltree: JSON.parse(jsonData) });
    }

    parseMessages() {
        const messages = [...this.state.messages];
        if (messages.length <= 0) {
            return;
        }

        for (let i = messages.length - 1; i > -1; i--) {
            if (messages[i].time > Date.now()) {
                continue;
            }

            messages.splice(i, 1);
        }

        this.setState({ messages });
    }

    factionError(msg) {
        const messages = [...this.state.messages];
        messages.push({ time: Date.now() + 2000, msg, type: 'error' });
        this.setState({ messages });
    }

    factionSuccess(msg) {
        const messages = [...this.state.messages];
        messages.push({ time: Date.now() + 2000, msg, type: 'success' });
        this.setState({ messages });
    }

    setMyData(rank, id) {
        this.setState({ myrank: rank, myid: id });
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
            notice: newData.notice,
            vehiclepoints: JSON.parse(newData.vehiclepoints),
            home: JSON.parse(newData.home),
            classification: newData.classification,
            subtype: newData.subtype
        };

        if (!this.state.hasMounted) {
            refinedData.hasMounted = true;
            refinedData.page = 0;
        }

        this.setState(refinedData);
    }

    keyUp(e) {
        if (this.typing) return;
        if ('alt' in window) {
            if (e.key === 'Escape') {
                alt.emit('faction:Close');
            }
        }
    }

    editing(e) {
        const targetEdit = e.target.id;
        if (!targetEdit) {
            return;
        }

        this.setState({ editing: targetEdit });
    }

    removeRank(index) {
        const ranks = [...this.state.ranks];
        ranks.splice(index, 1);
        this.setState({ ranks });
        if ('alt' in window) {
            alt.emit('faction:RemoveRank', index);
        }
    }

    appendRank(name) {
        const ranks = [...this.state.ranks];
        ranks.push({ name, flags: 0 });
        this.setState({ ranks });
        if ('alt' in window) {
            alt.emit('faction:AppendRank', name);
        }
    }

    saveRank(index, name) {
        if (!name) {
            return;
        }

        if (name.length <= 3) {
            return;
        }

        const ranks = [...this.state.ranks];
        ranks[index].name = name;
        this.setState({ ranks });
        if ('alt' in window) {
            alt.emit('faction:SaveRank', index, name);
        }
    }

    changeRankFlag(index, flagName) {
        const permission = permissions[flagName];
        if (!permission) {
            return;
        }

        if (index === 0) {
            return;
        }

        const ranks = [...this.state.ranks];
        if (!ranks[index]) {
            return;
        }

        if (isFlagged(ranks[index].flags, permission)) {
            ranks[index].flags -= permission;
        } else {
            ranks[index].flags += permission;
        }

        this.setState({ ranks });
        if ('alt' in window) {
            alt.emit('faction:SetFlags', index, ranks[index].flags);
        }
    }

    save(value) {
        if (!this.state.editing) {
            return;
        }

        if ('alt' in window) {
            alt.emit('faction:SaveInfo', this.state.editing, value);
        }

        this.setState({ [this.state.editing]: value, editing: undefined });
    }

    navigate(e) {
        const page = parseInt(e.target.id);
        this.setState({ page });
    }

    navigationRender() {
        const buttons = Object.keys(this.pages).map((key, index) => {
            const activePage = this.state.page === index ? 'navbtn active' : 'navbtn';
            return h(
                'button',
                { class: activePage, id: index, onclick: this.navigate.bind(this) },
                key
            );
        });

        return h('div', { class: 'navbtns' }, buttons);
    }

    kick(memberID) {
        const members = [...this.state.members];
        const index = members.findIndex(member => {
            if (member.id === memberID) {
                return member;
            }
        });

        if (index <= -1) {
            return;
        }

        members.splice(index, 1);
        this.setState({ members });

        if ('alt' in window) {
            alt.emit('faction:Kick', memberID);
        }
    }

    setRank(memberID, rank) {
        const members = [...this.state.members];
        const index = members.findIndex(member => {
            if (member.id === memberID) {
                return member;
            }
        });

        if (index <= -1) {
            return;
        }

        members[index].rank += rank;

        if (members[index].rank < 0) {
            members[index].rank = 0;
        }

        if (members[index].rank > this.state.ranks.length - 1) {
            members[index].rank = this.state.ranks.length - 1;
        }

        this.setState({ members });

        if ('alt' in window) {
            if (rank < 0) {
                alt.emit('faction:RankUp', memberID);
            } else {
                alt.emit('faction:RankDown', memberID);
            }
        }
    }

    render() {
        const messages = this.state.messages.map(message => {
            return h('div', { class: 'message' }, message.msg);
        });

        if (this.state.page === -2) {
            return h('div', { class: 'wait' }, 'Please wait...');
        }

        const key = Object.keys(this.pages)[this.state.page];
        const renderPage = this.pages[key];
        const functions = {
            markAsTyping: this.markAsTyping.bind(this),
            unmarkAsTyping: this.unmarkAsTyping.bind(this),
            editing: this.editing.bind(this),
            save: this.save.bind(this),
            setRank: this.setRank.bind(this),
            kick: this.kick.bind(this),
            saveRank: this.saveRank.bind(this),
            removeRank: this.removeRank.bind(this),
            appendRank: this.appendRank.bind(this),
            changeRankFlag: this.changeRankFlag.bind(this),
            factionError: this.factionError.bind(this),
            navigate: this.navigate.bind(this)
        };

        return h(
            'div',
            { class: 'content' },
            renderPage &&
                h('div', { class: 'navigation' }, h(this.navigationRender.bind(this))),
            renderPage &&
                h(
                    'div',
                    { class: 'page' },
                    h(renderPage, {
                        state: this.state,
                        functions
                    })
                ),
            !renderPage &&
                h(
                    'div',
                    { class: 'specialPage' },
                    h(CreateFaction, { state: this.state, functions })
                ),
            h('div', { class: 'messages' }, messages)
        );
    }
}

class Board extends Component {
    constructor(props) {
        super(props);
    }

    transformText(text) {
        if (!text) {
            return '';
        }

        const paragraphs = text.split(/\r?\n/);
        return paragraphs.map(text => {
            if (text.match(/[\#]{3}/)) {
                text = text.replace(/[\#]{3}/, '');
                return h('h3', {}, text);
            }

            if (text.match(/[\#]{2}/)) {
                text = text.replace(/[\#]{2}/, '');
                return h('h2', {}, text);
            }

            if (text.match(/[\#]{1}/)) {
                text = text.replace(/[\#]{1}/, '');
                return h('h1', {}, text);
            }

            return h('p', {}, text);
        });
    }

    renderNoticeBoardEditor({ state, functions }) {
        return h(
            'div',
            { class: 'placeholder' },
            h('textarea', {
                id: 'noticeBoardEditor',
                class: 'noticeboard',
                type: 'text',
                placeholder: 'Set notice board text...',
                value: state.notice
            }),
            h(
                'button',
                {
                    class: 'edit',
                    id: 'notice',
                    onclick: e => {
                        const noticeBoard = document.getElementById('noticeBoardEditor');
                        const value = noticeBoard.value;
                        functions.save(value);
                    }
                },
                'Save'
            )
        );
    }

    renderNameEditor({ state, functions }) {
        return h(
            'div',
            { class: 'placeholder' },
            h('input', {
                id: 'factionNameEditor',
                type: 'text',
                value: state.name,
                placeholder: 'Set faction name...'
            }),
            h(
                'button',
                {
                    class: 'edit',
                    id: 'notice',
                    onclick: e => {
                        const noticeBoard = document.getElementById('factionNameEditor');
                        const value = noticeBoard.value;
                        functions.save(value);
                    }
                },
                'Save'
            )
        );
    }

    render(props) {
        const state = props.state;
        const noticeText = this.transformText(state.notice);
        const isOwner = state.id === state.myid ? true : false;
        const editNameBtn = h(
            'button',
            {
                class: 'edit',
                id: 'name',
                onclick: props.functions.editing.bind(this)
            },
            'Edit Faction Name'
        );

        const editNoticeBtn = h(
            'button',
            {
                class: 'edit',
                id: 'notice',
                onclick: props.functions.editing.bind(this)
            },
            'Edit Notice Board'
        );

        return h(
            'div',
            { class: 'pageBoard' },
            h('h3', { class: 'header' }, state.name),
            h('div', { class: 'data' }, noticeText),
            isOwner && !state.editing && editNameBtn,
            isOwner && !state.editing && editNoticeBtn,
            isOwner &&
                state.editing === 'name' &&
                h(this.renderNameEditor, { state, functions: props.functions }),
            isOwner &&
                state.editing === 'notice' &&
                h(this.renderNoticeBoardEditor, { state, functions: props.functions })
        );
    }
}

class Members extends Component {
    constructor(props) {
        super(props);
        this.state = {
            members: {}
        };
    }

    expandMember(e) {
        const members = { ...this.state.members };
        const id = parseInt(e.target.id);
        const value = this.state.members[id] ? false : true;
        members[id] = value;
        this.setState({ members });
    }

    renderMember(myRank, myFlags, props, member, rankName, setRank, kick) {
        const state = props.state;
        const isExpanded = this.state.members[member.id] ? true : false;
        const activeTime = new Date(member.active);

        let canKick =
            isFlagged(myFlags, permissions.KICK) && member.rank > myRank ? true : false;

        let ableToChangeRanks =
            isFlagged(myFlags, permissions.PROMOTE) && member.rank > myRank;
        let ableToPromote = ableToChangeRanks && member.rank - 1 > myRank;
        let ableToUnPromote = ableToChangeRanks && member.rank + 1 > myRank;

        if (state.id === state.myid) {
            canKick = true;
            ableToChangeRanks = true;
            ableToPromote = true;
            ableToUnPromote = true;
        }

        return h(
            'div',
            { class: 'member' },
            h(
                'div',
                { class: 'fields' },
                !isExpanded &&
                    h(
                        'button',
                        {
                            class: 'manageMember',
                            id: member.id,
                            onclick: this.expandMember.bind(this)
                        },
                        '+'
                    ),
                isExpanded &&
                    h(
                        'button',
                        {
                            class: 'manageMember',
                            id: member.id,
                            onclick: this.expandMember.bind(this)
                        },
                        '-'
                    ),
                h('div', { class: 'name' }, `(${rankName}) ${member.name}`)
            ),
            isExpanded &&
                h(
                    'div',
                    { class: 'permissions' },
                    ableToChangeRanks &&
                        h(
                            'div',
                            { class: 'rank' },
                            ableToUnPromote &&
                                h(
                                    'button',
                                    {
                                        class: 'rankbtn',
                                        onclick: () => {
                                            setRank(member.id, 1);
                                        }
                                    },
                                    '-'
                                ),
                            h(
                                'div',
                                { class: 'ranklabel' },
                                `${member.rank} (${rankName})`
                            ),
                            ableToPromote &&
                                h(
                                    'button',
                                    {
                                        class: 'rankbtn',
                                        onclick: () => {
                                            setRank(member.id, -1);
                                        }
                                    },
                                    '+'
                                )
                        ),
                    canKick &&
                        h(
                            'button',
                            {
                                onclick: () => {
                                    kick(member.id);
                                }
                            },
                            'Kick'
                        ),
                    h(
                        'div',
                        { class: 'active' },
                        `Last Login: ${activeTime.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}`
                    )
                )
        );
    }

    renderMembers({ props, members, ranks, functions }) {
        members = members.sort((a, b) => {
            return a.rank - b.rank;
        });

        const me = members.find(member => {
            if (member.id === props.state.myid) {
                return member;
            }
        });

        const membersData = members.map(member => {
            return this.renderMember(
                me.rank,
                ranks[me.rank].flags,
                props,
                member,
                ranks[member.rank].name,
                functions.setRank,
                functions.kick
            );
        });

        membersData.push(h('div', { class: 'newRank' }));
        return h('div', { class: 'members' }, membersData);
    }

    render(props) {
        const state = props.state;
        return h(
            'div',
            { class: 'membersPage' },
            h(this.renderMembers.bind(this), {
                props,
                members: state.members,
                ranks: state.ranks,
                functions: props.functions
            })
        );
    }
}

class Ranks extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditing: false,
            editing: -1
        };
    }

    toggleProperties(e) {
        const name = e.target.id;

        if (!name) {
            return;
        }

        const value = this.state[name] ? false : true;
        this.setState({ [name]: value });
    }

    renderExpandButtons({ rank }) {
        if (this.state[rank.name]) {
            return h(
                'button',
                {
                    id: rank.name,
                    class: 'toggle',
                    onclick: this.toggleProperties.bind(this)
                },
                '-'
            );
        }

        return h(
            'button',
            {
                id: rank.name,
                class: 'toggle',
                onclick: this.toggleProperties.bind(this)
            },
            '+'
        );
    }

    renderRankEditor({ props, isEditing, editingHere, rank, index }) {
        return h(
            'div',
            { class: 'rankInput' },
            !isEditing &&
                h(
                    'button',
                    {
                        class: 'edit',
                        onclick: () => {
                            this.setState({
                                isEditing: true,
                                editing: index
                            });
                        }
                    },
                    'Edit Rank Name'
                ),
            isEditing &&
                editingHere &&
                h('input', {
                    type: 'text',
                    id: `rank@${index}`,
                    placeholder: 'Set rank name. Must be > 3 characters.',
                    value: rank.name
                }),
            isEditing &&
                editingHere &&
                h(
                    'button',
                    {
                        class: 'edit',
                        onclick: () => {
                            const data = document.getElementById(`rank@${index}`);
                            props.functions.saveRank(index, data.value);
                            this.setState({ isEditing: false });
                        }
                    },
                    'Save'
                )
        );
    }

    renderRemoveableButton({ props, index }) {
        return h(
            'button',
            {
                class: 'remove',
                onclick: () => {
                    props.functions.removeRank(index);
                }
            },
            'X'
        );
    }

    renderFlagsEditor({ index, props, rank }) {
        const flags = Object.keys(permissions).map(key => {
            if (key === 'MIN' || key === 'MAX') {
                return;
            }

            const isChecked = isFlagged(rank.flags, permissions[key]);
            return h(
                'div',
                { class: 'checkContainer' },
                h('div', { class: 'label' }, key),
                h('input', {
                    class: 'flagBox',
                    onclick: () => {
                        props.functions.changeRankFlag(index, key);
                    },
                    type: 'checkbox',
                    checked: isChecked
                })
            );
        });

        return h('div', { class: 'rankFlags' }, flags);
    }

    render(props) {
        const state = props.state;
        const isOwner = state.myid === state.id ? true : false;
        const isEditing = this.state.isEditing;

        const ranks = state.ranks.map((rank, index) => {
            const editingHere = index === this.state.editing;
            const isRemoveable = index >= 2;

            if (!isOwner) {
                return h(
                    'div',
                    { class: 'rank' },
                    h('div', { class: 'rankNumber' }, index),
                    h('div', { class: 'rankName' }, rank.name)
                );
            }

            return h(
                'div',
                { class: 'rank' },
                h(
                    'div',
                    { class: 'info' },
                    h(this.renderExpandButtons.bind(this), { rank }),
                    h(
                        'div',
                        { class: 'rankData' },
                        h('div', { class: 'rankNumber' }, index),
                        h('div', { class: 'rankName' }, rank.name)
                    ),
                    isRemoveable &&
                        h(this.renderRemoveableButton.bind(this), { props, index }),
                    !isRemoveable && h('button', { class: 'toggle disabled' }, 'X')
                ),
                this.state[rank.name] &&
                    h(
                        'div',
                        { class: 'properties' },
                        h(this.renderRankEditor.bind(this), {
                            props,
                            isEditing,
                            editingHere,
                            rank,
                            index
                        }),
                        index !== 0 &&
                            h(this.renderFlagsEditor.bind(this), { index, props, rank })
                    )
            );
        });

        if (isOwner) {
            ranks.push(
                h(
                    'div',
                    { class: 'addRankInput' },
                    h('input', {
                        class: 'rankInput',
                        type: 'text',
                        placeholder: 'Append a new rank.',
                        id: 'appendNewRank'
                    }),
                    h(
                        'button',
                        {
                            class: 'saveRank',
                            onclick: () => {
                                const value = document.getElementById('appendNewRank')
                                    .value;

                                if (!value) {
                                    return;
                                }

                                if (value.length <= 3) {
                                    return;
                                }

                                props.functions.appendRank(value);
                            }
                        },
                        'Add New Rank'
                    )
                )
            );
        }

        return h('div', { class: 'rankPage' }, h('div', { class: 'ranks' }, ranks));
    }
}

class Skills extends Component {
    constructor(props) {
        super(props);
    }

    setSubType(e) {
        const type = e.target.id;

        if (!type) {
            return;
        }

        if ('alt' in window) {
            alt.emit('faction:SetSubType', type);
        } else {
            console.log(type);
        }
    }

    renderSubSkills({ props }) {
        const state = props.state;
        const subTree = state.skilltree[state.classification];
        if (state.subtype === '') {
            const subtypes = Object.keys(subTree).map(key => {
                return h(
                    'div',
                    { class: 'subtype' },
                    h('h4', {}, `${key.toUpperCase()} Subtype`),
                    h('p', {}, subTree[key].desc),
                    h(
                        'button',
                        {
                            class: 'subtypebtn',
                            id: key,
                            onclick: this.setSubType.bind(this)
                        },
                        `Select ${key.toUpperCase()} Subtype`
                    )
                );
            });

            return h(
                'div',
                { class: 'selectType' },
                h('h3', {}, 'Select Faction Subtype'),
                h(
                    'p',
                    {},
                    'A subtype will give you access to a specific skill tree for your faction.'
                ),
                subtypes
            );
        }

        // Show other Types
        return 'Working!';
    }

    render(props) {
        return h(
            'div',
            { class: 'skillPage' },
            h(this.renderSubSkills.bind(this), { props })
        );
    }
}

class Options extends Component {
    constructor(props) {
        super(props);
    }

    disband() {
        if ('alt' in window) {
            alt.emit('faction:Disband');
        }
    }

    setHome() {
        if ('alt' in window) {
            alt.emit('faction:SetHome');
        }
    }

    addVehiclePoint() {
        if ('alt' in window) {
            alt.emit('faction:AddVehiclePoint');
        }
    }

    rmvVehiclePoint() {
        if ('alt' in window) {
            alt.emit('faction:RemoveVehiclePoint');
        }
    }

    renderDisbandOption({ props }) {
        return h(
            'div',
            { class: 'option' },
            h(
                'p',
                { class: 'description' },
                'Warning! This will completely delete your faction and all members will be kicked out.'
            ),
            h(
                'div',
                { class: 'optionData' },
                h('input', {
                    id: 'disbandInput',
                    type: 'text',
                    placeholder: 'Type your gang name'
                }),
                h(
                    'button',
                    {
                        onclick: () => {
                            const value = document.getElementById('disbandInput').value;

                            if (!value) {
                                return;
                            }

                            if (props.state.name !== value) {
                                props.functions.factionError(
                                    'Failed to match faction name.'
                                );
                                return;
                            }
                            this.disband();
                        }
                    },
                    'Disband Faction'
                )
            )
        );
    }

    renderSetHome({ props }) {
        return h(
            'div',
            { class: 'option' },
            h('p', { class: 'description' }, 'Set the home point for your faction.'),
            h(
                'div',
                { class: 'optionData' },
                h(
                    'button',
                    {
                        class: 'fullwidth',
                        onclick: this.setHome.bind(this)
                    },
                    'Set Current Location as Home'
                )
            )
        );
    }

    renderVehicleSpawns({ props }) {
        const state = props.state;

        return h(
            'div',
            { class: 'option' },
            h(
                'p',
                { class: 'description' },
                `Vehicle Spawn Points: ${state.vehiclepoints.length}`
            ),
            h(
                'div',
                { class: 'optionData' },
                h(
                    'button',
                    {
                        class: 'fullwidth',
                        onclick: this.addVehiclePoint.bind(this)
                    },
                    'Add Spawn Here'
                ),
                h(
                    'button',
                    {
                        class: 'fullwidth',
                        onclick: this.rmvVehiclePoint.bind(this)
                    },
                    'Remove Closest'
                )
            )
        );
    }

    render(props) {
        return h(
            'div',
            { class: 'optionPage' },
            h(this.renderDisbandOption.bind(this), { props }),
            h(this.renderSetHome.bind(this), { props }),
            h(this.renderVehicleSpawns.bind(this), { props })
        );
    }
}

class CreateFaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: -1
        };
    }

    beginCreation(e) {
        const type = parseInt(e.target.id);
        this.setState({ type });
    }

    setupFaction(factionName) {
        if (factionName.length <= 3) {
            return;
        }

        if ('alt' in window) {
            alt.emit('faction:Create', this.state.type, factionName);
        }
    }

    renderFactionSelection() {
        const pageNames = ['gang', 'police', 'ems', 'business'];
        const pages = pageNames.map((page, index) => {
            return h(
                'div',
                { class: 'group' },
                h('h4', { class: 'factionLabel' }, page.toUpperCase()),
                h(
                    'div',
                    { class: 'icon-wrapper' },
                    h('svg', {
                        type: 'image/svg+xml',
                        style: `background: url('../icons/${page}.svg');`
                    })
                ),
                h(
                    'button',
                    {
                        class: 'factionBtn',
                        id: index,
                        onclick: this.beginCreation.bind(this)
                    },
                    'Create'
                )
            );
        });

        return h('div', { class: 'pages' }, pages);
    }

    renderFactionNameInput({ props }) {
        return h(
            'div',
            { class: 'pages' },
            h(
                'div',
                { class: 'group' },
                h('h3', { class: 'factionLabel' }, 'Input Faction Name'),
                h('input', {
                    type: 'text',
                    id: 'factionName',
                    placeholder: 'Set Faction Name'
                }),
                h(
                    'button',
                    {
                        class: 'factionBtn',
                        onclick: () => {
                            const value = document.getElementById('factionName').value;
                            if (value.length <= 3) {
                                props.functions.factionError(
                                    'Name must be greater than 3 characters.'
                                );
                                return;
                            }

                            props.functions.navigate({ target: { id: -2 } });
                            this.setupFaction(value);
                        }
                    },
                    'Save'
                )
            )
        );
    }

    render(props) {
        return h(
            'div',
            { class: 'factionPage' },
            this.state.type === -1 && h(this.renderFactionSelection.bind(this)),
            this.state.type !== -1 && h(this.renderFactionNameInput.bind(this), { props })
        );
    }
}

render(h(App), document.querySelector('#render'));
