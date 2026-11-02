const SYMPTOMS = [
    {
        name: "Headache",
        keywords: ["headache", "head ache", "head pain", "migraine"],
        products: ["Over-the-counter pain relievers such as paracetamol or ibuprofen"],
        selfCare: [
            "Rest in a quiet, dark room",
            "Drink enough water",
            "Take regular breaks from screens"
        ],
        seeDoctor: [
            "A sudden, very severe headache",
            "Headache with fever, stiff neck, confusion or a rash",
            "Headache after a head injury",
            "Headaches that keep coming back or last more than a few days"
        ]
    },
    {
        name: "Sore throat",
        keywords: ["sore throat", "throat", "painful swallowing"],
        products: ["Throat lozenges or sprays", "Pain relievers such as paracetamol or ibuprofen"],
        selfCare: [
            "Drink warm fluids",
            "Gargle with warm salt water",
            "Rest your voice"
        ],
        seeDoctor: [
            "Difficulty breathing or swallowing",
            "High fever",
            "Symptoms lasting longer than a week"
        ]
    },
    {
        name: "Cough",
        keywords: ["cough", "coughing", "dry cough", "chesty cough"],
        products: ["Cough syrups – a pharmacist can help you choose between dry and chesty cough remedies"],
        selfCare: [
            "Drink plenty of fluids",
            "A spoon of honey can soothe the throat (not for children under one year)",
            "Keep indoor air humid"
        ],
        seeDoctor: [
            "A cough lasting more than three weeks",
            "Coughing up blood",
            "Shortness of breath or chest pain"
        ]
    },
    {
        name: "Common cold",
        keywords: ["cold", "runny nose", "blocked nose", "stuffy nose", "sneezing", "congestion"],
        products: ["Saline nasal spray", "Decongestant nasal sprays for short-term use only"],
        selfCare: [
            "Rest and keep warm",
            "Drink plenty of fluids",
            "Wash your hands often to avoid spreading the virus"
        ],
        seeDoctor: [
            "Symptoms that last longer than ten days",
            "High fever or severe facial pain"
        ]
    },
    {
        name: "Fever",
        keywords: ["fever", "temperature", "high temperature", "chills"],
        products: ["Fever reducers such as paracetamol or ibuprofen"],
        selfCare: [
            "Rest",
            "Drink plenty of fluids",
            "Wear light clothing"
        ],
        seeDoctor: [
            "Temperature of 39 °C or higher",
            "Fever lasting more than three days",
            "Fever with a rash, stiff neck, confusion or difficulty breathing",
            "Any fever in a baby younger than three months"
        ]
    },
    {
        name: "Heartburn",
        keywords: ["heartburn", "acid reflux", "reflux", "indigestion", "burning chest"],
        products: ["Antacids"],
        selfCare: [
            "Eat smaller meals",
            "Avoid eating two to three hours before bed",
            "Limit coffee, alcohol and spicy food"
        ],
        seeDoctor: [
            "Heartburn more than twice a week",
            "Difficulty swallowing or unexplained weight loss",
            "Chest pain – this can be a sign of a heart problem"
        ]
    },
    {
        name: "Seasonal allergies",
        keywords: ["allergy", "allergies", "hay fever", "itchy eyes", "pollen"],
        products: ["Non-drowsy antihistamines", "Saline nasal rinse"],
        selfCare: [
            "Keep windows closed when pollen counts are high",
            "Shower and change clothes after spending time outdoors"
        ],
        seeDoctor: [
            "Wheezing or difficulty breathing",
            "Swelling of the face, lips or tongue – call 124 immediately"
        ]
    },
    {
        name: "Muscle pain",
        keywords: ["muscle pain", "muscle ache", "sore muscles", "back pain", "sprain", "strain"],
        products: ["Topical pain-relief gels", "Pain relievers such as ibuprofen"],
        selfCare: [
            "Rest the affected area",
            "Apply a cold pack in the first 48 hours, then warmth",
            "Return to activity gradually"
        ],
        seeDoctor: [
            "Severe swelling or bruising",
            "You cannot put weight on the injured limb",
            "Numbness or tingling"
        ]
    },
    {
        name: "Dry skin",
        keywords: ["dry skin", "itchy skin", "flaky skin", "skin"],
        products: ["Fragrance-free moisturising creams", "Gentle, soap-free cleansers"],
        selfCare: [
            "Moisturise straight after washing",
            "Use lukewarm rather than hot water",
            "Use a humidifier in heated rooms"
        ],
        seeDoctor: [
            "Cracked or bleeding skin",
            "Redness, warmth or pus that may indicate an infection"
        ]
    },
    {
        name: "Trouble sleeping",
        keywords: ["insomnia", "sleep", "can't sleep", "cannot sleep", "sleeplessness"],
        products: ["Herbal sleep aids – ask a pharmacist whether they suit you"],
        selfCare: [
            "Go to bed and wake up at the same time every day",
            "Avoid caffeine in the afternoon and evening",
            "Keep screens out of the bedroom"
        ],
        seeDoctor: [
            "Sleep problems lasting longer than three weeks",
            "Sleeplessness that affects your daily life"
        ]
    },
    {
        name: "Diarrhoea",
        keywords: ["diarrhea", "diarrhoea", "upset stomach", "loose stools"],
        products: ["Oral rehydration salts"],
        selfCare: [
            "Drink plenty of fluids in small sips",
            "Eat light, bland food",
            "Wash your hands frequently"
        ],
        seeDoctor: [
            "Blood in the stool",
            "Symptoms lasting more than two days",
            "Signs of dehydration such as dizziness or very little urine"
        ]
    }
];

const form = document.getElementById("symptom-form");
const input = document.getElementById("symptom-input");
const result = document.getElementById("symptom-result");
const chips = document.getElementById("symptom-chips");
const datalist = document.getElementById("symptom-list");

function normalise(text) {
    return text.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
}

function findSymptom(query) {
    const text = normalise(query);
    if (!text) {
        return null;
    }

    const exact = SYMPTOMS.find(symptom => normalise(symptom.name) === text);
    if (exact) {
        return exact;
    }

    let bestMatch = null;
    let bestLength = 0;

    for (const symptom of SYMPTOMS) {
        for (const keyword of symptom.keywords) {
            if ((text.includes(keyword) || keyword.includes(text)) && keyword.length > bestLength) {
                bestMatch = symptom;
                bestLength = keyword.length;
            }
        }
    }

    return bestMatch;
}

function createElement(tag, text, className) {
    const element = document.createElement(tag);
    if (text) {
        element.textContent = text;
    }
    if (className) {
        element.className = className;
    }
    return element;
}

function createList(items, className) {
    const list = createElement("ul", null, className);
    for (const item of items) {
        list.appendChild(createElement("li", item));
    }
    return list;
}

function renderSymptom(symptom) {
    result.replaceChildren(
        createElement("h3", symptom.name),
        createElement("h4", "Products a pharmacist may suggest"),
        createList(symptom.products),
        createElement("h4", "Self-care tips"),
        createList(symptom.selfCare),
        createElement("h4", "See a doctor if you notice"),
        createList(symptom.seeDoctor, "red-flags")
    );
    result.hidden = false;
}

function renderNotFound(query) {
    const message = createElement("p");
    message.append("No information found for ");
    message.appendChild(createElement("strong", `"${query}"`));
    message.append(". Try one of the common symptoms above, or ask our pharmacist through the contact form.");

    result.replaceChildren(createElement("h3", "No match found"), message);
    result.hidden = false;
}

function search(query) {
    const symptom = findSymptom(query);
    if (symptom) {
        renderSymptom(symptom);
    } else {
        renderNotFound(query.trim());
    }
}

for (const symptom of SYMPTOMS) {
    const chip = createElement("button", symptom.name, "chip");
    chip.type = "button";
    chip.addEventListener("click", () => {
        input.value = symptom.name;
        search(symptom.name);
    });
    chips.appendChild(chip);

    const option = document.createElement("option");
    option.value = symptom.name;
    datalist.appendChild(option);
}

form.addEventListener("submit", event => {
    event.preventDefault();
    if (input.value.trim()) {
        search(input.value);
    } else {
        input.focus();
    }
});
