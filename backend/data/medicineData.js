const medicines = [
  { name: "Paracetamol", category: "Pain Reliever", usage: "Fever, mild pain", dosage: "500mg", type: "Tablet" },
  { name: "Amoxicillin", category: "Antibiotic", usage: "Bacterial infections", dosage: "250mg", type: "Capsule" },
  { name: "Azithromycin", category: "Antibiotic", usage: "Respiratory infections", dosage: "500mg", type: "Tablet" },
  { name: "Cetirizine", category: "Antihistamine", usage: "Allergy, sneezing", dosage: "10mg", type: "Tablet" },
  { name: "Ibuprofen", category: "NSAID", usage: "Pain, inflammation", dosage: "400mg", type: "Tablet" },
  { name: "Pantoprazole", category: "Antacid", usage: "Acidity, ulcers", dosage: "40mg", type: "Tablet" },
  { name: "Metformin", category: "Antidiabetic", usage: "Type 2 diabetes", dosage: "500mg", type: "Tablet" },
  { name: "Amlodipine", category: "Antihypertensive", usage: "High blood pressure", dosage: "5mg", type: "Tablet" },
  { name: "Losartan", category: "Antihypertensive", usage: "Hypertension", dosage: "50mg", type: "Tablet" },
  { name: "Atorvastatin", category: "Cholesterol Control", usage: "High cholesterol", dosage: "10mg", type: "Tablet" },

  { name: "Montelukast", category: "Antiallergic", usage: "Asthma, allergies", dosage: "10mg", type: "Tablet" },
  { name: "Levocetirizine", category: "Antihistamine", usage: "Cold, itching", dosage: "5mg", type: "Tablet" },
  { name: "Omeprazole", category: "Antacid", usage: "Heartburn, acidity", dosage: "20mg", type: "Capsule" },
  { name: "Dolo 650", category: "Pain Reliever", usage: "Fever, headache", dosage: "650mg", type: "Tablet" },
  { name: "Clarithromycin", category: "Antibiotic", usage: "Throat infections", dosage: "250mg", type: "Tablet" },
  { name: "Folic Acid", category: "Supplement", usage: "Anemia, pregnancy", dosage: "5mg", type: "Tablet" },
  { name: "Calcium Carbonate", category: "Supplement", usage: "Bone health", dosage: "500mg", type: "Tablet" },
  { name: "Vitamin D3", category: "Supplement", usage: "Bone and immunity", dosage: "1000 IU", type: "Capsule" },
  { name: "Insulin Glargine", category: "Antidiabetic", usage: "Diabetes control", dosage: "10ml vial", type: "Injection" },
  { name: "Ranitidine", category: "Antacid", usage: "Acid reflux", dosage: "150mg", type: "Tablet" },

  { name: "Ondansetron", category: "Antiemetic", usage: "Nausea, vomiting", dosage: "4mg", type: "Tablet" },
  { name: "Domperidone", category: "Antiemetic", usage: "Indigestion", dosage: "10mg", type: "Tablet" },
  { name: "Dicyclomine", category: "Antispasmodic", usage: "Stomach pain", dosage: "20mg", type: "Tablet" },
  { name: "Loperamide", category: "Antidiarrheal", usage: "Loose motion", dosage: "2mg", type: "Capsule" },
  { name: "Betadine", category: "Antiseptic", usage: "Wound cleaning", dosage: "Topical", type: "Ointment" },
  { name: "Budesonide", category: "Inhaler", usage: "Asthma, COPD", dosage: "100mcg", type: "Inhaler" },
  { name: "Salbutamol", category: "Bronchodilator", usage: "Breathing issues", dosage: "100mcg", type: "Inhaler" },
  { name: "Hydroxyzine", category: "Antihistamine", usage: "Itching, anxiety", dosage: "25mg", type: "Tablet" },
  { name: "Metoprolol", category: "Beta Blocker", usage: "Heart disease", dosage: "50mg", type: "Tablet" },
  { name: "Clopidogrel", category: "Antiplatelet", usage: "Prevent clots", dosage: "75mg", type: "Tablet" },

  { name: "Aspirin", category: "Antiplatelet", usage: "Heart protection", dosage: "75mg", type: "Tablet" },
  { name: "Prednisolone", category: "Steroid", usage: "Inflammation", dosage: "10mg", type: "Tablet" },
  { name: "Cefixime", category: "Antibiotic", usage: "UTI, infections", dosage: "200mg", type: "Tablet" },
  { name: "Diclofenac", category: "Pain Reliever", usage: "Muscle pain", dosage: "50mg", type: "Tablet" },
  { name: "Rabeprazole", category: "Antacid", usage: "Acid reflux", dosage: "20mg", type: "Tablet" },
  { name: "Amikacin", category: "Antibiotic", usage: "Severe infections", dosage: "500mg", type: "Injection" },
  { name: "Fluconazole", category: "Antifungal", usage: "Fungal infections", dosage: "150mg", type: "Tablet" },
  { name: "Miconazole", category: "Antifungal", usage: "Skin infections", dosage: "2%", type: "Cream" },
  { name: "Cough Syrup", category: "Cough Suppressant", usage: "Dry cough", dosage: "10ml", type: "Syrup" },
  { name: "Iron Folic Syrup", category: "Supplement", usage: "Iron deficiency", dosage: "10ml", type: "Syrup" },

  { name: "Insulin Aspart", category: "Antidiabetic", usage: "Diabetes management", dosage: "3ml", type: "Injection" },
  { name: "Hydrocortisone", category: "Steroid", usage: "Allergic reaction", dosage: "100mg", type: "Injection" },
  { name: "Levofloxacin", category: "Antibiotic", usage: "Bacterial infection", dosage: "500mg", type: "Tablet" },
  { name: "Zinc Sulphate", category: "Supplement", usage: "Immunity boost", dosage: "50mg", type: "Tablet" },
  { name: "Thyroxine", category: "Hormone", usage: "Thyroid disorder", dosage: "50mcg", type: "Tablet" },
  { name: "Hydralazine", category: "Antihypertensive", usage: "High blood pressure", dosage: "25mg", type: "Tablet" },
  { name: "Simethicone", category: "Antiflatulent", usage: "Gas relief", dosage: "40mg", type: "Tablet" },
  { name: "Ceftriaxone", category: "Antibiotic", usage: "Severe infections", dosage: "1g", type: "Injection" },
  { name: "Benzoyl Peroxide", category: "Antiacne", usage: "Pimple treatment", dosage: "2.5%", type: "Gel" },
  { name: "Chloramphenicol", category: "Antibiotic", usage: "Eye infection", dosage: "0.5%", type: "Eye Drops" },
  {
    name: "Naproxen",
    category: "Pain Relief",
    usage_info: "Used to treat pain and inflammation due to arthritis or injury.",
    dosage: "250mg twice daily after meals",
    type: "Tablet"
  },
  {
    name: "Clindamycin",
    category: "Antibiotic",
    usage_info: "Used to treat skin and bone infections.",
    dosage: "300mg every 8 hours for 7 days",
    type: "Capsule"
  },
  {
    name: "Lisinopril",
    category: "Antihypertensive",
    usage_info: "Used to control high blood pressure and heart failure.",
    dosage: "10mg once daily",
    type: "Tablet"
  },
  {
    name: "Furosemide",
    category: "Diuretic",
    usage_info: "Used to remove excess fluid in cases of heart failure.",
    dosage: "40mg once daily in morning",
    type: "Tablet"
  },
  {
    name: "Gliclazide",
    category: "Antidiabetic",
    usage_info: "Used to control blood sugar in type 2 diabetes.",
    dosage: "40mg twice daily before meals",
    type: "Tablet"
  },
  {
    name: "Gabapentin",
    category: "Neuropathic Pain",
    usage_info: "Used for nerve pain and seizures.",
    dosage: "300mg twice daily",
    type: "Capsule"
  },
  {
    name: "Sertraline",
    category: "Antidepressant",
    usage_info: "Used to treat depression and anxiety disorders.",
    dosage: "50mg once daily",
    type: "Tablet"
  },
  {
    name: "Tamsulosin",
    category: "Urology",
    usage_info: "Used for urinary problems caused by enlarged prostate.",
    dosage: "0.4mg once daily after dinner",
    type: "Capsule"
  },
  {
    name: "Doxycycline",
    category: "Antibiotic",
    usage_info: "Used for bacterial infections including acne and malaria.",
    dosage: "100mg twice daily for 7 days",
    type: "Capsule"
  },
  {
    name: "Meloxicam",
    category: "Pain Relief",
    usage_info: "Used for arthritis and musculoskeletal pain.",
    dosage: "15mg once daily",
    type: "Tablet"
  },
  {
    name: "Hydrochlorothiazide",
    category: "Diuretic",
    usage_info: "Used to reduce blood pressure and fluid retention.",
    dosage: "25mg once daily",
    type: "Tablet"
  },
  {
    name: "Propranolol",
    category: "Beta Blocker",
    usage_info: "Used for anxiety, tremors, and hypertension.",
    dosage: "40mg twice daily",
    type: "Tablet"
  },
  {
    name: "Diazepam",
    category: "Anxiolytic",
    usage_info: "Used for anxiety, muscle spasms, and seizures.",
    dosage: "5mg as needed, max 3 times a day",
    type: "Tablet"
  },
  {
    name: "Loratadine",
    category: "Antihistamine",
    usage_info: "Used for allergic rhinitis and itching.",
    dosage: "10mg once daily",
    type: "Tablet"
  },
  {
    name: "Isotretinoin",
    category: "Dermatology",
    usage_info: "Used for severe acne resistant to other treatments.",
    dosage: "20mg once daily with food",
    type: "Capsule"
  },
  {
    name: "Ketoconazole",
    category: "Antifungal",
    usage_info: "Used for fungal infections of skin and nails.",
    dosage: "2% cream once daily",
    type: "Cream"
  },
  {
    name: "Nitroglycerin",
    category: "Cardiac Care",
    usage_info: "Used to relieve chest pain (angina).",
    dosage: "One tablet under the tongue during chest pain",
    type: "Tablet"
  },
  {
    name: "Clonazepam",
    category: "Anticonvulsant",
    usage_info: "Used to prevent seizures and panic disorders.",
    dosage: "0.5mg twice daily",
    type: "Tablet"
  },
  {
    name: "Tetracycline",
    category: "Antibiotic",
    usage_info: "Used for acne, respiratory, and urinary infections.",
    dosage: "500mg every 6 hours",
    type: "Capsule"
  },
  {
    name: "Amphotericin B",
    category: "Antifungal",
    usage_info: "Used for severe systemic fungal infections.",
    dosage: "Injection as prescribed by doctor",
    type: "Injection"
  },
  {
    name: "Carbamazepine",
    category: "Neurology",
    usage_info: "Used for epilepsy and nerve pain.",
    dosage: "200mg twice daily",
    type: "Tablet"
  },
  {
    name: "Methotrexate",
    category: "Immunosuppressant",
    usage_info: "Used for rheumatoid arthritis and psoriasis.",
    dosage: "10mg once weekly",
    type: "Tablet"
  },
  {
    name: "Spironolactone",
    category: "Diuretic",
    usage_info: "Used to treat fluid retention and hormonal acne.",
    dosage: "25mg once daily",
    type: "Tablet"
  },
  {
    name: "Warfarin",
    category: "Anticoagulant",
    usage_info: "Used to prevent blood clots in veins and arteries.",
    dosage: "5mg once daily",
    type: "Tablet"
  },
  {
    name: "Morphine",
    category: "Pain Relief",
    usage_info: "Used for severe pain management.",
    dosage: "10mg injection as prescribed",
    type: "Injection"
  },
  {
    name: "Erythromycin",
    category: "Antibiotic",
    usage_info: "Used for respiratory and skin infections.",
    dosage: "500mg every 6 hours",
    type: "Tablet"
  },
  {
    name: "Phenylephrine Nasal Drops",
    category: "Decongestant",
    usage_info: "Used to relieve nasal congestion.",
    dosage: "2 drops per nostril every 6 hours",
    type: "Drops"
  },
  {
    name: "Ofloxacin Eye Drops",
    category: "Antibiotic",
    usage_info: "Used to treat bacterial eye infections.",
    dosage: "1 drop every 4 hours",
    type: "Eye Drops"
  },
  {
    name: "Guaifenesin Syrup",
    category: "Expectorant",
    usage_info: "Used to loosen mucus and relieve cough.",
    dosage: "10ml thrice daily",
    type: "Syrup"
  },
  {
    name: "Digoxin",
    category: "Cardiac",
    usage_info: "Used to treat heart failure and arrhythmia.",
    dosage: "0.25mg once daily",
    type: "Tablet"
  },
  {
    name: "Caffeine + Paracetamol",
    category: "Pain Relief",
    usage_info: "Used to relieve headache and fatigue.",
    dosage: "500mg paracetamol + 65mg caffeine as needed",
    type: "Tablet"
  },
  {
    name: "Tretinoin Cream",
    category: "Dermatology",
    usage_info: "Used for acne and skin rejuvenation.",
    dosage: "Apply thin layer at night",
    type: "Cream"
  },
  {
    name: "Ferrous Sulfate",
    category: "Supplement",
    usage_info: "Used to treat iron deficiency anemia.",
    dosage: "325mg once daily after meals",
    type: "Tablet"
  },
  {
    name: "Magnesium Hydroxide",
    category: "Antacid",
    usage_info: "Used to relieve indigestion and acidity.",
    dosage: "10ml after meals",
    type: "Syrup"
  },
  {
    name: "Bisacodyl",
    category: "Laxative",
    usage_info: "Used for relief of constipation.",
    dosage: "5mg once daily at bedtime",
    type: "Tablet"
  },
  {
    name: "Acetazolamide",
    category: "Diuretic",
    usage_info: "Used to treat glaucoma and altitude sickness.",
    dosage: "250mg twice daily",
    type: "Tablet"
  },
  {
    name: "Glycopyrrolate",
    category: "Anticholinergic",
    usage_info: "Used to reduce secretions and treat ulcers.",
    dosage: "1mg twice daily",
    type: "Tablet"
  },
  {
    name: "Nifedipine",
    category: "Antihypertensive",
    usage_info: "Used for high blood pressure and chest pain.",
    dosage: "10mg thrice daily",
    type: "Tablet"
  },
  {
    name: "Triamcinolone Ointment",
    category: "Corticosteroid",
    usage_info: "Used for skin inflammation and itching.",
    dosage: "Apply thin layer twice daily",
    type: "Ointment"
  },
  {
    name: "Povidone Iodine Gargle",
    category: "Antiseptic",
    usage_info: "Used for throat infections and mouth ulcers.",
    dosage: "Gargle with 10ml twice daily",
    type: "Liquid"
  },
  {
    name: "Azelaic Acid Cream",
    category: "Dermatology",
    usage_info: "Used for acne and pigmentation.",
    dosage: "Apply twice daily on affected area",
    type: "Cream"
  },
  {
    name: "Baclofen",
    category: "Muscle Relaxant",
    usage_info: "Used to relieve muscle spasms.",
    dosage: "10mg thrice daily",
    type: "Tablet"
  },
  {
    name: "Lorazepam",
    category: "Anxiolytic",
    usage_info: "Used to relieve anxiety and sleep disorders.",
    dosage: "1mg once or twice daily",
    type: "Tablet"
  },
  {
    name: "Chlorhexidine Mouthwash",
    category: "Antiseptic",
    usage_info: "Used to reduce oral bacteria and plaque.",
    dosage: "Rinse with 10ml twice daily",
    type: "Liquid"
  },
  {
    name: "Methyldopa",
    category: "Antihypertensive",
    usage_info: "Used for high blood pressure during pregnancy.",
    dosage: "250mg twice daily",
    type: "Tablet"
  },
  {
    name: "Fluticasone Nasal Spray",
    category: "Allergy Relief",
    usage_info: "Used to relieve nasal allergy symptoms.",
    dosage: "1 spray per nostril once daily",
    type: "Spray"
  },
  {
    name: "Tranexamic Acid",
    category: "Hemostatic",
    usage_info: "Used to control bleeding in heavy periods.",
    dosage: "500mg thrice daily for 5 days",
    type: "Tablet"
  }
  // add more if needed


];

export default medicines;
