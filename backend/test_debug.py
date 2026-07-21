from app.services.scorer import rule_based_score
from app.services.llm import local_fallback_llm_score
from test_pipeline import TEST_DATA

with open("debug_output.txt", "w") as f:
    f.write(f"{'Label':<30} | {'Expected':<8} | {'Rule':<5} | {'LLM':<5} | {'Fused':<5} | {'Patterns':<20}\n")
    f.write("-" * 90 + "\n")
    for case in TEST_DATA:
        text = case["text"]
        is_scam = case["is_scam"]
        label = case["label"]
        
        r_score, r_pat = rule_based_score(text)
        l_res = local_fallback_llm_score(text)
        l_score = l_res["score"]
        l_pat = l_res["matched_patterns"]
        
        fused = (0.4 * r_score) + (0.6 * l_score)
        
        f.write(f"{label:<30} | {'SCAM' if is_scam else 'SAFE':<8} | {r_score:<5.1f} | {l_score:<5.1f} | {fused:<5.1f} | {', '.join(r_pat)}\n")
