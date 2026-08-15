class NodeRegistry:
    def __init__(self):
        self.active_solvers = {} # {node_id: {compute_power, latency, trust_score}}

    def register_node(self, node_id, hardware_specs):
        """世界中の全デバイスをソルバーノードとして自律登録"""
        self.active_solvers[node_id] = {
            "specs": hardware_specs,
            "status": "READY",
            "contribution_sats": 0
        }
        return f"NODE_REGISTERED: {node_id}"

# 各ノードが演算貢献に応じて報酬を得るためのプローブ
def distribute_reward(node_id, amount):
    # 演算演算力に応じた報酬分配
    pass

