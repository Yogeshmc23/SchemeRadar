
from typing import TypedDict, Callable, Any

from langgraph.graph import StateGraph, START, END


# ---------------------------------------------------------
# SchemeRadar Agent State
# ---------------------------------------------------------

class AgentState(TypedDict, total=False):
    mode: str
    message: str
    query: str
    student: dict
    route: str
    response: dict


# ---------------------------------------------------------
# Build LangGraph Workflow
# ---------------------------------------------------------

def build_agent(
    chat_handler: Callable[[str], dict],
    research_handler: Callable[[str], dict],
    discover_handler: Callable[[str, dict], dict],
):

    # Decide which workflow to execute.
    def router(state: AgentState):
        return {"route": state["mode"]}

    # Chat workflow using Qwen.
    def chat_node(state: AgentState):
        result = chat_handler(state["message"])
        return {"response": result}

    # Research workflow using TinyFish + Qwen.
    def research_node(state: AgentState):
        result = research_handler(state["query"])
        return {"response": result}

    # Scholarship discovery and matching workflow.
    def discover_node(state: AgentState):
        result = discover_handler(
            state["query"],
            state["student"],
        )
        return {"response": result}

    # Create the graph.
    workflow = StateGraph(AgentState)

    workflow.add_node("router", router)
    workflow.add_node("chat", chat_node)
    workflow.add_node("research", research_node)
    workflow.add_node("discover", discover_node)

    # Start with the router.
    workflow.add_edge(START, "router")

    # Choose the appropriate workflow.
    workflow.add_conditional_edges(
        "router",
        lambda state: state["route"],
        {
            "chat": "chat",
            "research": "research",
            "discover": "discover",
        },
    )

    # Finish after the selected workflow.
    workflow.add_edge("chat", END)
    workflow.add_edge("research", END)
    workflow.add_edge("discover", END)

    return workflow.compile()
