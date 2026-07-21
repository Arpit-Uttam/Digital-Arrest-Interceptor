from app.services.scorer import rule_based_score, calculate_fusion_score
from app.services.llm import local_fallback_llm_score

def test_rule_based_scorer_scam():
    """
    Verifies that the rule-based scanner detects authority impersonation and isolation keywords.
    """
    score, matched = rule_based_score("This is CBI calling. Do not speak to anyone.")
    assert score > 0.0
    assert "Authority Impersonation" in matched
    assert "Isolation" in matched

def test_rule_based_scorer_safe():
    """
    Verifies that normal conversation text yields a zero risk score.
    """
    score, matched = rule_based_score("Hello, let's meet for lunch at the cafeteria.")
    assert score == 0.0
    assert len(matched) == 0

def test_local_fallback_llm_score_scam():
    """
    Verifies that the local fallback semantic analyzer flags high-density scam indicators.
    """
    res = local_fallback_llm_score("ED officer here. Transfer security deposit right now or you face immediate jail.")
    assert res["score"] >= 80.0
    assert "Authority Impersonation" in res["matched_patterns"]
    assert "Payment Coercion" in res["matched_patterns"]
    assert "Urgency" in res["matched_patterns"]

def test_local_fallback_llm_score_safe():
    """
    Verifies that safe messages register low semantic threat ratings.
    """
    res = local_fallback_llm_score("Hey mom, I will be home in ten minutes.")
    assert res["score"] <= 10.0

def test_fusion_score():
    """
    Verifies the mathematical fusion scoring calculation (40% rule weight, 60% LLM weight).
    """
    rule = 50.0
    llm = 80.0
    # Fused score = (0.4 * 50) + (0.6 * 80) = 20 + 48 = 68
    fused = calculate_fusion_score(rule, llm)
    assert fused == 68.0
