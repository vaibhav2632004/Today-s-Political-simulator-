// Game State Management
class PoliticalSimulator {
    constructor() {
        this.gameState = {
            currentScreen: 'welcome',
            country: null,
            character: null,
            party: null,
            campaign: {
                support: 25,
                funds: 1000000,
                daysRemaining: 90,
                events: []
            },
            election: {
                results: null,
                coalition: null,
                parliamentSeats: {
                    yourParty: 0,
                    oppositionA: 0,
                    oppositionB: 0,
                    others: 0,
                    total: 300
                }
            },
            cabinet: {},
            parliament: {
                bills: [],
                billIdCounter: 1,
                sessionsHeld: 0,
                billsPassed: 0,
                billsFailed: 0
            },
            governance: {
                approval: 65,
                term: 1,
                year: 1,
                economy: {
                    gdpGrowth: 2.5,
                    unemployment: 5.2,
                    inflation: 2.1,
                    budgetBalance: -2.3
                },
                diplomacy: {
                    allies: [],
                    neutral: [],
                    hostile: []
                },
                internal: {
                    crimeRate: 'Medium',
                    educationIndex: 7.2,
                    healthcareQuality: 'Good',
                    infrastructureQuality: 'Fair'
                },
                military: {
                    strength: 'Strong',
                    defenseBudget: 2.1,
                    securityLevel: 'High',
                    cyberDefense: 'Advanced'
                }
            },
            events: {
                currentEvent: null,
                eventHistory: []
            }
        };
        
        this.countries = {
            usa: {
                name: 'United States',
                population: '331M',
                gdp: '$23T',
                government: 'Federal Republic',
                allies: ['United Kingdom', 'Canada', 'Australia', 'Japan'],
                neutral: ['China', 'Russia', 'India', 'Brazil'],
                hostile: ['North Korea', 'Iran']
            },
            uk: {
                name: 'United Kingdom',
                population: '67M',
                gdp: '$3.1T',
                government: 'Constitutional Monarchy',
                allies: ['United States', 'Canada', 'Australia', 'France'],
                neutral: ['China', 'Russia', 'India'],
                hostile: ['Iran', 'North Korea']
            },
            germany: {
                name: 'Germany',
                population: '83M',
                gdp: '$4.2T',
                government: 'Federal Republic',
                allies: ['France', 'United Kingdom', 'United States', 'Poland'],
                neutral: ['China', 'Russia', 'Turkey'],
                hostile: ['Iran', 'North Korea']
            },
            france: {
                name: 'France',
                population: '68M',
                gdp: '$2.9T',
                government: 'Semi-Presidential Republic',
                allies: ['Germany', 'United Kingdom', 'United States', 'Italy'],
                neutral: ['China', 'Russia', 'Algeria'],
                hostile: ['Iran', 'North Korea']
            },
            india: {
                name: 'India',
                population: '1.4B',
                gdp: '$3.7T',
                government: 'Federal Republic',
                allies: ['United States', 'Japan', 'Australia', 'Israel'],
                neutral: ['China', 'Russia', 'United Kingdom'],
                hostile: ['Pakistan', 'China (disputed)']
            },
            japan: {
                name: 'Japan',
                population: '125M',
                gdp: '$4.9T',
                government: 'Constitutional Monarchy',
                allies: ['United States', 'Australia', 'South Korea', 'India'],
                neutral: ['China', 'Russia', 'United Kingdom'],
                hostile: ['North Korea']
            }
        };

        this.realLifeEvents = [
            {
                id: 'economic_crisis',
                title: 'Global Economic Recession',
                description: 'A major economic downturn is affecting global markets. Unemployment is rising and businesses are struggling. How do you respond?',
                category: 'economic',
                options: [
                    {
                        text: 'Implement massive stimulus package',
                        effects: { budgetBalance: -1.5, unemployment: -1.0, approval: 3 },
                        consequence: 'Your stimulus package helps reduce unemployment but increases national debt significantly.'
                    },
                    {
                        text: 'Focus on austerity measures',
                        effects: { budgetBalance: 0.8, unemployment: 0.5, approval: -2 },
                        consequence: 'Austerity measures improve fiscal balance but worsen unemployment and public approval.'
                    },
                    {
                        text: 'Balanced approach with targeted support',
                        effects: { budgetBalance: -0.5, unemployment: -0.3, approval: 1 },
                        consequence: 'Your balanced approach provides moderate relief while maintaining fiscal responsibility.'
                    }
                ]
            },
            {
                id: 'pandemic_outbreak',
                title: 'Global Health Pandemic',
                description: 'A new infectious disease is spreading rapidly across borders. Public health experts are calling for immediate action.',
                category: 'health',
                options: [
                    {
                        text: 'Implement strict lockdown measures',
                        effects: { gdpGrowth: -2.0, approval: -1, healthcareQuality: 'Excellent' },
                        consequence: 'Lockdown measures slow the spread but severely impact the economy.'
                    },
                    {
                        text: 'Focus on healthcare system strengthening',
                        effects: { budgetBalance: -0.8, approval: 2, healthcareQuality: 'Excellent' },
                        consequence: 'Investment in healthcare improves response capacity and public confidence.'
                    },
                    {
                        text: 'Minimal intervention, focus on economy',
                        effects: { gdpGrowth: 0.5, approval: -3, healthcareQuality: 'Poor' },
                        consequence: 'Economic activity continues but public health suffers, leading to criticism.'
                    }
                ]
            },
            {
                id: 'climate_disaster',
                title: 'Major Climate Disaster',
                description: 'Severe flooding/wildfires have devastated several regions. Citizens are demanding immediate action on climate change.',
                category: 'environmental',
                options: [
                    {
                        text: 'Launch massive green infrastructure program',
                        effects: { budgetBalance: -1.2, approval: 4, infrastructureQuality: 'Excellent' },
                        consequence: 'Your green infrastructure program wins praise but requires significant investment.'
                    },
                    {
                        text: 'Focus on immediate disaster relief only',
                        effects: { budgetBalance: -0.3, approval: 1 },
                        consequence: 'Disaster relief helps affected areas but doesn\'t address long-term climate concerns.'
                    },
                    {
                        text: 'Implement carbon tax and regulations',
                        effects: { approval: -1, gdpGrowth: -0.3 },
                        consequence: 'Environmental regulations face business opposition but show commitment to climate action.'
                    }
                ]
            },
            {
                id: 'international_conflict',
                title: 'International Military Conflict',
                description: 'A conflict has erupted between two allied nations. The international community is looking for leadership.',
                category: 'foreign',
                options: [
                    {
                        text: 'Lead diplomatic mediation efforts',
                        effects: { approval: 3, defenseBudget: 0.2 },
                        consequence: 'Your diplomatic leadership enhances international standing and prevents escalation.'
                    },
                    {
                        text: 'Provide military support to allies',
                        effects: { approval: -1, defenseBudget: 0.8 },
                        consequence: 'Military support strengthens alliances but increases defense spending and domestic opposition.'
                    },
                    {
                        text: 'Maintain neutrality and focus domestically',
                        effects: { approval: -2 },
                        consequence: 'Neutrality disappoints allies and reduces international influence.'
                    }
                ]
            },
            {
                id: 'cyber_attack',
                title: 'Major Cyber Security Breach',
                description: 'Critical infrastructure has been targeted by sophisticated cyber attacks. National security is at risk.',
                category: 'security',
                options: [
                    {
                        text: 'Massive cybersecurity investment',
                        effects: { budgetBalance: -0.6, cyberDefense: 'Superior', approval: 2 },
                        consequence: 'Cybersecurity investment strengthens defenses and restores public confidence.'
                    },
                    {
                        text: 'International cooperation on cyber norms',
                        effects: { approval: 1 },
                        consequence: 'International cooperation helps establish cyber norms but provides limited immediate protection.'
                    },
                    {
                        text: 'Retaliate against suspected attackers',
                        effects: { approval: -2 },
                        consequence: 'Retaliation escalates tensions and may provoke further attacks.'
                    }
                ]
            },
            {
                id: 'social_unrest',
                title: 'Widespread Social Protests',
                description: 'Large-scale protests over social inequality are occurring in major cities. Public order is being challenged.',
                category: 'social',
                options: [
                    {
                        text: 'Address underlying social issues with reforms',
                        effects: { approval: 3, budgetBalance: -0.8 },
                        consequence: 'Social reforms address root causes and improve long-term stability.'
                    },
                    {
                        text: 'Increase police presence and law enforcement',
                        effects: { approval: -2, crimeRate: 'Low' },
                        consequence: 'Heavy-handed response restores order but increases social tensions.'
                    },
                    {
                        text: 'Engage in dialogue with protest leaders',
                        effects: { approval: 1 },
                        consequence: 'Dialogue shows willingness to listen but may not satisfy all demands.'
                    }
                ]
            }
        ];

        this.ministers = [
            { name: 'Sarah Johnson', expertise: 'finance', experience: 'Former Bank Executive' },
            { name: 'Michael Chen', expertise: 'foreign', experience: 'Career Diplomat' },
            { name: 'General Roberts', expertise: 'defense', experience: 'Military Veteran' },
            { name: 'Dr. Williams', expertise: 'health', experience: 'Public Health Expert' },
            { name: 'Prof. Martinez', expertise: 'education', experience: 'Education Reformer' },
            { name: 'James Thompson', expertise: 'interior', experience: 'Law Enforcement Background' },
            { name: 'Lisa Anderson', expertise: 'finance', experience: 'Economic Advisor' },
            { name: 'David Kim', expertise: 'foreign', experience: 'International Relations' },
            { name: 'Colonel Davis', expertise: 'defense', experience: 'Intelligence Officer' },
            { name: 'Dr. Brown', expertise: 'health', experience: 'Medical Research' }
        ];

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('welcome');
        this.loadGame();
    }

    setupEventListeners() {
        // Welcome screen
        document.getElementById('start-game').addEventListener('click', () => {
            this.showScreen('country');
        });

        document.getElementById('load-game').addEventListener('click', () => {
            this.loadGame();
        });

        // Country selection
        document.querySelectorAll('.country-card').forEach(card => {
            card.addEventListener('click', () => {
                this.selectCountry(card.dataset.country);
            });
        });

        document.getElementById('country-next').addEventListener('click', () => {
            this.showScreen('character');
        });

        // Character creation
        document.getElementById('character-back').addEventListener('click', () => {
            this.showScreen('country');
        });

        document.getElementById('character-next').addEventListener('click', () => {
            this.createCharacter();
        });

        // Party creation
        document.getElementById('party-back').addEventListener('click', () => {
            this.showScreen('character');
        });

        document.getElementById('party-next').addEventListener('click', () => {
            this.createParty();
        });

        // Campaign actions
        document.querySelectorAll('.action-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.performCampaignAction(btn.dataset.action);
            });
        });

        document.getElementById('skip-to-election').addEventListener('click', () => {
            this.conductElection();
        });

        // Parliament formation
        document.getElementById('form-government').addEventListener('click', () => {
            this.showScreen('cabinet');
        });

        // Cabinet selection
        document.getElementById('cabinet-confirm').addEventListener('click', () => {
            this.confirmCabinet();
        });

        // Main game tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.switchTab(btn.dataset.tab);
            });
        });

        // Policy actions
        document.querySelectorAll('.policy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.executePolicy(btn.dataset.policy);
            });
        });

        // Form validation
        this.setupFormValidation();
    }

    setupFormValidation() {
        // Character form validation
        const characterInputs = ['character-name', 'character-background', 'character-ideology'];
        characterInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.validateCharacterForm();
            });
        });

        // Party form validation
        const partyInputs = ['party-name', 'party-ideology'];
        partyInputs.forEach(id => {
            document.getElementById(id).addEventListener('input', () => {
                this.validatePartyForm();
            });
        });

        // Policy checkboxes
        document.querySelectorAll('.checkbox-group input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                this.validatePartyForm();
            });
        });

        // Cabinet validation
        document.querySelectorAll('.minister-select').forEach(select => {
            select.addEventListener('change', () => {
                this.validateCabinetForm();
            });
        });
    }

    showScreen(screenName) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        document.getElementById(`${screenName}-screen`).classList.add('active');
        this.gameState.currentScreen = screenName;
        
        // Initialize screen-specific content
        if (screenName === 'cabinet') {
            this.populateMinisterOptions();
        } else if (screenName === 'main') {
            this.updateMainGameDisplay();
        }
        
        this.saveGame();
    }

    selectCountry(countryCode) {
        document.querySelectorAll('.country-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        document.querySelector(`[data-country="${countryCode}"]`).classList.add('selected');
        this.gameState.country = this.countries[countryCode];
        
        document.getElementById('country-next').disabled = false;
    }

    validateCharacterForm() {
        const name = document.getElementById('character-name').value.trim();
        const background = document.getElementById('character-background').value;
        const ideology = document.getElementById('character-ideology').value;
        
        const isValid = name && background && ideology;
        const nextBtn = document.getElementById('character-next');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
        
        return isValid;
    }

    createCharacter() {
        if (!this.validateCharacterForm()) return;
        
        this.gameState.character = {
            name: document.getElementById('character-name').value.trim(),
            age: parseInt(document.getElementById('character-age').value),
            background: document.getElementById('character-background').value,
            ideology: document.getElementById('character-ideology').value
        };
        
        this.showScreen('party');
    }

    validatePartyForm() {
        const name = document.getElementById('party-name').value.trim();
        const ideology = document.getElementById('party-ideology').value;
        const checkedPolicies = document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked');
        
        const isValid = name && ideology && checkedPolicies.length === 3;
        const nextBtn = document.getElementById('party-next');
        if (nextBtn) {
            nextBtn.disabled = !isValid;
        }
        
        return isValid;
    }

    createParty() {
        if (!this.validatePartyForm()) return;
        
        const checkedPolicies = Array.from(document.querySelectorAll('.checkbox-group input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        
        this.gameState.party = {
            name: document.getElementById('party-name').value.trim(),
            ideology: document.getElementById('party-ideology').value,
            policies: checkedPolicies
        };
        
        this.initializeCampaign();
        this.showScreen('campaign');
    }

    initializeCampaign() {
        this.updateCampaignDisplay();
        this.addCampaignEvent('Campaign officially launched! Good luck in the upcoming election.');
    }

    updateCampaignDisplay() {
        document.getElementById('support-progress').style.width = `${this.gameState.campaign.support}%`;
        document.getElementById('support-percentage').textContent = `${this.gameState.campaign.support}%`;
        document.getElementById('campaign-funds').textContent = `$${this.gameState.campaign.funds.toLocaleString()}`;
        document.getElementById('days-remaining').textContent = this.gameState.campaign.daysRemaining;
    }

    performCampaignAction(action) {
        const actions = {
            rally: { cost: 50000, minSupport: 2, maxSupport: 5, name: 'Rally' },
            debate: { cost: 25000, minSupport: 1, maxSupport: 8, name: 'TV Debate' },
            ads: { cost: 100000, minSupport: 3, maxSupport: 6, name: 'TV Advertisements' },
            grassroots: { cost: 30000, minSupport: 1, maxSupport: 4, name: 'Grassroots Campaign' },
            policy: { cost: 20000, minSupport: 2, maxSupport: 7, name: 'Policy Announcement' },
            'social-media': { cost: 15000, minSupport: 1, maxSupport: 3, name: 'Social Media Campaign' }
        };

        const actionData = actions[action];
        if (!actionData || this.gameState.campaign.funds < actionData.cost) {
            this.addCampaignEvent(`Insufficient funds for ${actionData.name}!`);
            return;
        }

        this.gameState.campaign.funds -= actionData.cost;
        const supportGain = Math.floor(Math.random() * (actionData.maxSupport - actionData.minSupport + 1)) + actionData.minSupport;
        this.gameState.campaign.support = Math.min(100, this.gameState.campaign.support + supportGain);
        this.gameState.campaign.daysRemaining = Math.max(0, this.gameState.campaign.daysRemaining - 7);

        this.addCampaignEvent(`${actionData.name} successful! Gained ${supportGain}% support.`);
        this.updateCampaignDisplay();

        // Random events
        if (Math.random() < 0.3) {
            this.triggerRandomEvent();
        }

        if (this.gameState.campaign.daysRemaining <= 0) {
            setTimeout(() => this.conductElection(), 1000);
        }
    }

    addCampaignEvent(message) {
        const eventLog = document.getElementById('event-log');
        if (!eventLog) return;
        
        const eventItem = document.createElement('div');
        eventItem.className = 'event-item';
        eventItem.textContent = message;
        
        eventLog.appendChild(eventItem);
        eventLog.scrollTop = eventLog.scrollHeight;
        
        this.gameState.campaign.events.push(message);
    }

    triggerRandomEvent() {
        const events = [
            { message: 'Economic scandal affects your campaign!', support: -3 },
            { message: 'Endorsement from popular celebrity!', support: 4 },
            { message: 'Opposition makes controversial statement!', support: 2 },
            { message: 'Natural disaster requires leadership response!', support: -1 },
            { message: 'International crisis boosts your foreign policy credentials!', support: 3 },
            { message: 'Debate performance goes viral!', support: 5 },
            { message: 'Campaign volunteer scandal emerges!', support: -2 }
        ];

        const event = events[Math.floor(Math.random() * events.length)];
        this.gameState.campaign.support = Math.max(0, Math.min(100, this.gameState.campaign.support + event.support));
        this.addCampaignEvent(event.message);
    }

    conductElection() {
        const baseChance = this.gameState.campaign.support;
        const randomFactor = Math.random() * 20 - 10; // -10 to +10
        const finalSupport = Math.max(0, Math.min(100, baseChance + randomFactor));
        
        const won = finalSupport >= 45; // Need at least 45% to win
        
        this.gameState.election.results = {
            playerParty: finalSupport,
            opposition1: Math.random() * (100 - finalSupport),
            opposition2: Math.random() * (100 - finalSupport),
            won: won
        };

        if (won) {
            this.addCampaignEvent(`Congratulations! You won the election with ${finalSupport.toFixed(1)}% of the vote!`);
            setTimeout(() => this.showScreen('parliament'), 2000);
        } else {
            this.addCampaignEvent(`Election lost. You received ${finalSupport.toFixed(1)}% of the vote. Better luck next time!`);
            setTimeout(() => this.showScreen('welcome'), 3000);
        }
    }

    populateMinisterOptions() {
        const positions = ['finance', 'foreign', 'defense', 'interior', 'health', 'education'];
        
        positions.forEach(position => {
            const select = document.querySelector(`[data-position="${position}"]`);
            if (!select) return;
            
            // Clear existing options except the first one
            select.innerHTML = '<option value="">Select Minister</option>';
            
            // Add relevant ministers
            const relevantMinisters = this.ministers.filter(minister => 
                minister.expertise === position || Math.random() < 0.3
            );
            
            relevantMinisters.forEach(minister => {
                const option = document.createElement('option');
                option.value = minister.name;
                option.textContent = `${minister.name} - ${minister.experience}`;
                select.appendChild(option);
            });
        });
    }

    validateCabinetForm() {
        const selects = document.querySelectorAll('.minister-select');
        const selectedValues = Array.from(selects).map(select => select.value).filter(value => value);
        const allSelected = selectedValues.length === selects.length;
        const noDuplicates = selectedValues.length === new Set(selectedValues).size;
        
        const confirmBtn = document.getElementById('cabinet-confirm');
        if (confirmBtn) {
            confirmBtn.disabled = !(allSelected && noDuplicates);
        }
        
        return allSelected && noDuplicates;
    }

    confirmCabinet() {
        if (!this.validateCabinetForm()) return;
        
        const positions = ['finance', 'foreign', 'defense', 'interior', 'health', 'education'];
        
        positions.forEach(position => {
            const select = document.querySelector(`[data-position="${position}"]`);
            this.gameState.cabinet[position] = select.value;
        });
        
        this.showScreen('main');
    }

    updateMainGameDisplay() {
        document.getElementById('country-name').textContent = this.gameState.country.name;
        document.getElementById('approval-rating').textContent = `${this.gameState.governance.approval}%`;
        document.getElementById('term-progress').textContent = `Year ${this.gameState.governance.year} of 4`;
        
        // Update economic indicators
        document.getElementById('gdp-growth').textContent = `${this.gameState.governance.economy.gdpGrowth}%`;
        document.getElementById('unemployment').textContent = `${this.gameState.governance.economy.unemployment}%`;
        document.getElementById('inflation').textContent = `${this.gameState.governance.economy.inflation}%`;
        document.getElementById('budget-balance').textContent = `${this.gameState.governance.economy.budgetBalance}%`;
        
        // Update diplomatic relations
        this.updateDiplomaticRelations();
        
        // Update internal affairs
        document.getElementById('crime-rate').textContent = this.gameState.governance.internal.crimeRate;
        document.getElementById('education-index').textContent = `${this.gameState.governance.internal.educationIndex}/10`;
        document.getElementById('healthcare-quality').textContent = this.gameState.governance.internal.healthcareQuality;
        document.getElementById('infrastructure-quality').textContent = this.gameState.governance.internal.infrastructureQuality;
        
        // Update military stats
        document.getElementById('military-strength').textContent = this.gameState.governance.military.strength;
        document.getElementById('defense-budget').textContent = `${this.gameState.governance.military.defenseBudget}% GDP`;
        document.getElementById('security-level').textContent = this.gameState.governance.military.securityLevel;
        document.getElementById('cyber-defense').textContent = this.gameState.governance.military.cyberDefense;
    }

    updateDiplomaticRelations() {
        const alliesList = document.getElementById('allies-list');
        const neutralList = document.getElementById('neutral-list');
        const hostileList = document.getElementById('hostile-list');
        
        if (alliesList) {
            alliesList.innerHTML = this.gameState.country.allies.map(ally => `<div>${ally}</div>`).join('');
        }
        if (neutralList) {
            neutralList.innerHTML = this.gameState.country.neutral.map(neutral => `<div>${neutral}</div>`).join('');
        }
        if (hostileList) {
            hostileList.innerHTML = this.gameState.country.hostile.map(hostile => `<div>${hostile}</div>`).join('');
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.remove('active');
        });
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    executePolicy(policyType) {
        const policies = {
            'tax-cut': {
                name: 'Tax Cut',
                effects: { gdpGrowth: 0.3, budgetBalance: -0.5, approval: 2 }
            },
            'spending-increase': {
                name: 'Increase Government Spending',
                effects: { unemployment: -0.2, budgetBalance: -0.8, approval: 1 }
            },
            'infrastructure': {
                name: 'Infrastructure Investment',
                effects: { gdpGrowth: 0.2, unemployment: -0.3, approval: 1 }
            },
            'regulation': {
                name: 'Deregulation',
                effects: { gdpGrowth: 0.4, approval: -1 }
            },
            'trade-deal': {
                name: 'Trade Deal',
                effects: { gdpGrowth: 0.3, approval: 1 }
            },
            'alliance': {
                name: 'Military Alliance',
                effects: { approval: 2 }
            },
            'sanctions': {
                name: 'Economic Sanctions',
                effects: { approval: -1 }
            },
            'summit': {
                name: 'International Summit',
                effects: { approval: 3 }
            },
            'police-funding': {
                name: 'Increase Police Funding',
                effects: { approval: 1 }
            },
            'education-reform': {
                name: 'Education Reform',
                effects: { approval: 2 }
            },
            'healthcare-expansion': {
                name: 'Healthcare Expansion',
                effects: { approval: 3 }
            },
            'infrastructure-upgrade': {
                name: 'Infrastructure Upgrade',
                effects: { approval: 2 }
            },
            'military-modernization': {
                name: 'Military Modernization',
                effects: { approval: 1 }
            },
            'defense-increase': {
                name: 'Increase Defense Spending',
                effects: { budgetBalance: -0.3, approval: 1 }
            },
            'peacekeeping': {
                name: 'Deploy Peacekeepers',
                effects: { approval: 2 }
            },
            'cyber-security': {
                name: 'Enhance Cyber Security',
                effects: { approval: 1 }
            }
        };

        const policy = policies[policyType];
        if (!policy) return;

        // Apply effects
        if (policy.effects.gdpGrowth) {
            this.gameState.governance.economy.gdpGrowth += policy.effects.gdpGrowth;
        }
        if (policy.effects.unemployment) {
            this.gameState.governance.economy.unemployment += policy.effects.unemployment;
        }
        if (policy.effects.budgetBalance) {
            this.gameState.governance.economy.budgetBalance += policy.effects.budgetBalance;
        }
        if (policy.effects.approval) {
            this.gameState.governance.approval = Math.max(0, Math.min(100, 
                this.gameState.governance.approval + policy.effects.approval));
        }

        // Show policy result
        this.showPolicyResult(policy.name);
        this.updateMainGameDisplay();
        this.saveGame();
    }

    showPolicyResult(policyName) {
        // Create a simple notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #667eea;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        notification.textContent = `${policyName} implemented successfully!`;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    saveGame() {
        try {
            localStorage.setItem('politicalSimulatorSave', JSON.stringify(this.gameState));
        } catch (error) {
            console.error('Failed to save game:', error);
        }
    }

    loadGame() {
        try {
            const savedGame = localStorage.getItem('politicalSimulatorSave');
            if (savedGame) {
                const parsedState = JSON.parse(savedGame);
                // Merge with default state to handle new properties
                this.gameState = { ...this.gameState, ...parsedState };
                this.showScreen(this.gameState.currentScreen);
                
                // Restore UI state based on current screen
                if (this.gameState.currentScreen === 'country' && this.gameState.country) {
                    // Restore country selection
                    const countryCode = Object.keys(this.countries).find(key => 
                        this.countries[key].name === this.gameState.country.name
                    );
                    if (countryCode) {
                        this.selectCountry(countryCode);
                    }
                }
            }
        } catch (error) {
            console.error('Failed to load game:', error);
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PoliticalSimulator();
});

