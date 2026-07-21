import json
from app.services.scorer import rule_based_score
from app.services.llm import local_fallback_llm_score

# 20+ test scenarios containing scam scripts and genuine conversations
TEST_DATA = [
    # --- SCAMS (Expected: Threat / High Risk) ---
    {
        "text": "This is Mumbai cyber cell. Your Aadhaar is blocked because of 2.5 Crore money laundering linked to CBI search. Lock your door and keep Skype camera active. Do not talk to family.",
        "is_scam": True,
        "label": "CBI Impersonation + Secrecy"
    },
    {
        "text": "Hello, customs officer from Delhi airport calling. Your international courier from Taiwan contains credit cards and contraband narcotics. A warrant under NDPS has been prepared. Pay fine now.",
        "is_scam": True,
        "label": "Customs Drug Parcel scam"
    },
    {
        "text": "This is Enforcement Directorate ED calling. We have tracked financial illegal activities in your bank accounts. You face immediate arrest within 30 minutes. Transfer security funds immediately.",
        "is_scam": True,
        "label": "ED Financial Audit Threat"
    },
    {
        "text": "Attention, DCP Cyber Crime speaking. Your name is listed in a Supreme Court warrant. Lock yourself in a room, stay on Skype camera for digital custody. Do not contact anyone.",
        "is_scam": True,
        "label": "Supreme Court Warrant Scam"
    },
    {
        "text": "This is RBI verification desk. Your account is flagged for money laundering. Please transfer your remaining liquid balance to our security audit account to verify your funds.",
        "is_scam": True,
        "label": "RBI Audit Scam"
    },
    {
        "text": "Delhi police department calling. Your son is under custody for criminal activities. To secure immediate release, transfer thirty thousand rupees deposit to this bank account right now.",
        "is_scam": True,
        "label": "Fake Kidnapping/Arrest Scam"
    },
    {
        "text": "National Security Division agent here. Do not disclose this call to anyone. Keep the line open. You are under suspicion for international illegal funds. Cooperate with security transfer.",
        "is_scam": True,
        "label": "National Security Impersonation"
    },
    {
        "text": "Mumbai customs cargo. We found illegal passports under your identity. You will be arrested soon. Stay online, lock your door, and audit bank details with our officer.",
        "is_scam": True,
        "label": "Contraband Passport Seizure"
    },
    {
        "text": "Your account has been audited by Income Tax. A warrant has been prepared. To stop immediate arrest, pay the tax clearance fee of 80,000 to the central bank clearance account.",
        "is_scam": True,
        "label": "IT Department Tax Coercion"
    },
    {
        "text": "Cyber security task force inspector. Your SIM card is involved in illegal money transactions. Your call is being recorded for digital arrest. Transfer cash to prevent jail.",
        "is_scam": True,
        "label": "SIM Card Cyber Coercion"
    },

    # --- GENUINE CONVERSATIONS (Expected: Safe / Low Risk) ---
    {
        "text": "Hi, I am calling from ICICI Bank security check. We noticed a charge of 45,000 rupees on your credit card. Did you authorize this transaction? No passwords or OTP needed.",
        "is_scam": False,
        "label": "Genuine Bank Card Check"
    },
    {
        "text": "Hello, I am the delivery agent from BlueDart. I am standing outside your gate. Can you please collect your Amazon order? No security pin is required.",
        "is_scam": False,
        "label": "Genuine Delivery Courier"
    },
    {
        "text": "Hey, this is Rahul. Are we still meeting for lunch today at 1 PM? Let me know if you are free. Call me back.",
        "is_scam": False,
        "label": "Genuine Friend Chat"
    },
    {
        "text": "Good afternoon, this is customer service for your broadband internet connection. We are scheduling router maintenance tomorrow morning. Will you be home?",
        "is_scam": False,
        "label": "Genuine Service Scheduling"
    },
    {
        "text": "Dear customer, this is an automated confirmation of your electricity bill payment. Your payment of 3,200 rupees was received. Thank you.",
        "is_scam": False,
        "label": "Genuine Utility Receipt"
    },
    {
        "text": "Hi Mom, I am stuck in traffic right now. I will reach home in about 20 minutes. Please don't worry.",
        "is_scam": False,
        "label": "Genuine Family Call"
    },
    {
        "text": "Hello, this is Dr. Sharma's clinic. Your routine health checkup is scheduled for Friday at 10 AM. Please carry your previous reports.",
        "is_scam": False,
        "label": "Genuine Doctor Appointment"
    },
    {
        "text": "Hi, this is HR calling from TechCorp. We reviewed your resume for the developer position. Are you available for a brief technical call tomorrow?",
        "is_scam": False,
        "label": "Genuine Job Interview Check"
    },
    {
        "text": "Hello, this is customer support from Swiggy. The delivery partner is unable to find your house location. Could you guide him?",
        "is_scam": False,
        "label": "Genuine Food Delivery Helper"
    },
    {
        "text": "Thank you for calling airlines support. Your seat change request is confirmed. We sent the updated e-ticket details to your email.",
        "is_scam": False,
        "label": "Genuine Airline Ticket Service"
    },
    {
        "text": "Hello, this is your Uber driver. I am waiting near the red post box. Please let me know if you can see my car.",
        "is_scam": False,
        "label": "Genuine Ride Share Driver"
    }
]

def run_tests():
    print("=" * 70)
    print("DIGITAL ARREST INTERCEPTOR - PIPELINE EVALUATION SUITE")
    print(f"Running evaluation over {len(TEST_DATA)} test conversations...")
    print("=" * 70)

    tp, fp, tn, fn = 0, 0, 0, 0
    scam_weights_rule = 0.4
    scam_weights_llm = 0.6
    threshold = 75.0

    print(f"{'Label':<35} | {'Expected':<8} | {'Score':<6} | {'Result':<8} | {'Matched Patterns'}")
    print("-" * 110)

    for case in TEST_DATA:
        text = case["text"]
        is_scam = case["is_scam"]
        label = case["label"]

        # Run rule-based analyzer
        rule_score, rule_patterns = rule_based_score(text)
        
        # Run offline semantic analyzer
        llm_res = local_fallback_llm_score(text)
        llm_score_val = llm_res["score"]
        llm_patterns = llm_res["matched_patterns"]

        # Fuse score
        fused_score = (scam_weights_rule * rule_score) + (scam_weights_llm * llm_score_val)
        all_patterns = list(set(rule_patterns + llm_patterns))

        predicted_scam = fused_score >= threshold
        
        # Classify outcomes
        if is_scam and predicted_scam:
            tp += 1
            outcome = "TP (Scam)"
        elif not is_scam and predicted_scam:
            fp += 1
            outcome = "FP (Alert)"
        elif not is_scam and not predicted_scam:
            tn += 1
            outcome = "TN (Safe)"
        else:
            fn += 1
            outcome = "FN (Miss)"

        patterns_str = ", ".join(all_patterns) if all_patterns else "None"
        print(f"{label:<35} | {'SCAM' if is_scam else 'SAFE':<8} | {fused_score:>5.1f}% | {outcome:<8} | {patterns_str}")

    # Compute Metrics
    total = len(TEST_DATA)
    accuracy = (tp + tn) / total
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0
    recall = tp / (tp + fn) if (tp + fn) > 0 else 0
    f1 = 2 * (precision * recall) / (precision + recall) if (precision + recall) > 0 else 0
    fp_rate = fp / (tn + fp) if (tn + fp) > 0 else 0

    print("=" * 70)
    print("METRICS ACCURACY REPORT")
    print("=" * 70)
    print(f"True Positives (Scams Caught):     {tp}")
    print(f"True Negatives (Genuine Safe):      {tn}")
    print(f"False Positives (False Alarms):     {fp}")
    print(f"False Negatives (Scams Missed):     {fn}")
    print("-" * 40)
    print(f"System Accuracy:                    {accuracy * 100:.1f}%")
    print(f"Precision (Detection Truth Rate):  {precision * 100:.1f}%")
    print(f"Recall (Sensitivity Rate):          {recall * 100:.1f}%")
    print(f"F1 Threat Score:                    {f1 * 100:.1f}%")
    print(f"False Positive Rate (FPR):          {fp_rate * 100:.1f}%")
    print("=" * 70)

    # Write report file
    with open("accuracy_report.txt", "w") as f:
        f.write("=" * 70 + "\n")
        f.write("DIGITAL ARREST INTERCEPTOR - ACCURACY REPORT\n")
        f.write("=" * 70 + "\n")
        f.write(f"Total Test Cases: {total}\n")
        f.write(f"Accuracy:         {accuracy * 100:.1f}%\n")
        f.write(f"Precision:        {precision * 100:.1f}%\n")
        f.write(f"Recall:           {recall * 100:.1f}%\n")
        f.write(f"F1 Score:         {f1 * 100:.1f}%\n")
        f.write(f"False Positive:   {fp_rate * 100:.1f}%\n")
        f.write("=" * 70 + "\n")

if __name__ == "__main__":
    run_tests()
