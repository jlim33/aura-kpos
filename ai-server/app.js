// Independent AI Server — Interactive Controller & System Flow Canvas

document.addEventListener('DOMContentLoaded', () => {
  initSystemCanvas();
  initArchTabs();
  initCalculator();
  initCodeSnippets();
});

// ==========================================
// 1. Interactive System Flow Canvas
// ==========================================
function initSystemCanvas() {
  const canvas = document.getElementById('systemCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const nodes = [
    { id: 'gateway', label: 'LiteLLM Gateway (:4000)', type: 'gw', x: 0.5, y: 0.5, radius: 24, color: '#8b5cf6' },
    { id: 'webui', label: 'Open WebUI (:3000)', type: 'ui', x: 0.25, y: 0.28, radius: 18, color: '#38bdf8' },
    { id: 'dify', label: 'Dify LLMOps (:80)', type: 'ui', x: 0.25, y: 0.72, radius: 18, color: '#38bdf8' },
    { id: 'ollama', label: 'Ollama / vLLM (:11434)', type: 'gpu', x: 0.75, y: 0.35, radius: 22, color: '#10b981' },
    { id: 'qdrant', label: 'Qdrant Vector DB (:6333)', type: 'rag', x: 0.75, y: 0.65, radius: 20, color: '#f59e0b' },
    { id: 'qwen', label: 'Qwen 2.5 Coder 14B', type: 'gpu', x: 0.9, y: 0.22, radius: 13, color: '#10b981' },
    { id: 'r1', label: 'DeepSeek-R1 14B', type: 'gpu', x: 0.9, y: 0.45, radius: 13, color: '#10b981' },
    { id: 'bge', label: 'BGE-M3 Embeddings', type: 'rag', x: 0.9, y: 0.78, radius: 13, color: '#f59e0b' },
    { id: 'langgraph', label: 'LangGraph Python Agent', type: 'ui', x: 0.1, y: 0.5, radius: 15, color: '#38bdf8' },
  ];

  const links = [
    { from: 'webui', to: 'gateway' },
    { from: 'dify', to: 'gateway' },
    { from: 'langgraph', to: 'gateway' },
    { from: 'gateway', to: 'ollama' },
    { from: 'gateway', to: 'qdrant' },
    { from: 'dify', to: 'qdrant' },
    { from: 'ollama', to: 'qwen' },
    { from: 'ollama', to: 'r1' },
    { from: 'qdrant', to: 'bge' },
  ];

  let draggedNode = null;
  let mouse = { x: null, y: null };

  canvas.addEventListener('mousedown', (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    nodes.forEach(n => {
      const nx = n.x * canvas.width;
      const ny = n.y * canvas.height;
      const dist = Math.hypot(mx - nx, my - ny);
      if (dist < n.radius + 8) {
        draggedNode = n;
      }
    });
  });

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;

    if (draggedNode) {
      draggedNode.x = Math.max(0.05, Math.min(0.95, mouse.x / canvas.width));
      draggedNode.y = Math.max(0.05, Math.min(0.95, mouse.y / canvas.height));
    }
  });

  window.addEventListener('mouseup', () => {
    draggedNode = null;
  });

  const resetBtn = document.getElementById('resetGraphBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      initSystemCanvas();
    });
  }

  let time = 0;
  function animate() {
    time += 0.015;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pulsating connections
    links.forEach(link => {
      const source = nodes.find(n => n.id === link.from);
      const target = nodes.find(n => n.id === link.to);
      if (!source || !target) return;

      const sx = source.x * canvas.width;
      const sy = source.y * canvas.height;
      const tx = target.x * canvas.width;
      const ty = target.y * canvas.height;

      const grad = ctx.createLinearGradient(sx, sy, tx, ty);
      grad.addColorStop(0, source.color + '66');
      grad.addColorStop(1, target.color + '66');

      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(tx, ty);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Traveling data packet
      const p = (Math.sin(time * 2.5 + sx) + 1) / 2;
      const px = sx + (tx - sx) * p;
      const py = sy + (ty - sy) * p;
      ctx.beginPath();
      ctx.arc(px, py, 2.5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = source.color;
      ctx.shadowBlur = 6;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Draw Nodes
    nodes.forEach(node => {
      let nx = node.x * canvas.width;
      let ny = node.y * canvas.height;

      // Gentle floating animation
      if (node !== draggedNode) {
        ny += Math.sin(time + nx) * 2.5;
      }

      // Outer glow ring
      ctx.beginPath();
      ctx.arc(nx, ny, node.radius + 4, 0, Math.PI * 2);
      ctx.strokeStyle = node.color + '44';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Main Node Fill
      ctx.beginPath();
      ctx.arc(nx, ny, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Label
      ctx.font = '600 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.fillText(node.label, nx, ny + node.radius + 15);
    });

    requestAnimationFrame(animate);
  }
  animate();
}

// ==========================================
// 2. Interactive Architecture Tabs
// ==========================================
function initArchTabs() {
  const tabs = document.querySelectorAll('.arch-tab-btn');
  const layers = document.querySelectorAll('.arch-layer');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const targetLayer = tab.getAttribute('data-layer');
      layers.forEach(layer => {
        if (targetLayer === 'all') {
          layer.classList.remove('dimmed', 'highlighted');
        } else if (layer.id === `layer-${targetLayer}`) {
          layer.classList.remove('dimmed');
          layer.classList.add('highlighted');
        } else {
          layer.classList.add('dimmed');
          layer.classList.remove('highlighted');
        }
      });
    });
  });
}

// ==========================================
// 3. Interactive Hardware & Sizing Calculator
// ==========================================
const tierData = {
  lite: {
    gpu: 'NVIDIA GeForce RTX 4060 Ti (16GB)',
    gpuDesc: 'Optimal for 7B-8B parameter models with low power consumption (165W).',
    ram: '32GB DDR5 + 1TB NVMe + 650W PSU',
    ramDesc: 'Fast document indexing with light multi-user concurrency.',
    models: 'Qwen 2.5 7B + Llama 3.1 8B + BGE-M3',
    modelDesc: 'Sub-second response time for summaries, search, and drafts.',
    roi: '3 - 4 Months',
    roiDesc: 'Compared to commercial cloud API token and seat subscriptions.'
  },
  pro: {
    gpu: 'NVIDIA GeForce RTX 4090 / 3090 (24GB VRAM)',
    gpuDesc: 'The gold standard for multi-agent workflows, code generation, and 14B-32B models.',
    ram: '64GB DDR5 + 2TB NVMe + 850W/1000W PSU',
    ramDesc: 'Run Vector DB, Dify agents, and LLMs simultaneously in GPU VRAM without paging.',
    models: 'Qwen 2.5 Coder 14B + DeepSeek-R1 14B + BGE-M3',
    modelDesc: 'High-speed reasoning, full multilingual understanding, and multi-agent loops.',
    roi: '4 - 6 Months',
    roiDesc: 'Break-even vs enterprise cloud API token budgets while keeping 100% data on premise.'
  },
  enterprise: {
    gpu: 'Dual NVIDIA RTX 3090 (48GB Total VRAM)',
    gpuDesc: 'Runs massive 70B parameter models (Llama 3.3 70B) at budget hardware cost.',
    ram: '128GB DDR5 + 4TB NVMe + 1300W PSU',
    ramDesc: 'Large enterprise document repository supporting 30+ concurrent team queries.',
    models: 'Llama 3.3 70B (Q4) + Qwen 2.5 32B + GraphRAG',
    modelDesc: 'Frontier reasoning accuracy with deep cross-document relational knowledge synthesis.',
    roi: '5 - 7 Months',
    roiDesc: 'Saves $15,000+ per year compared to custom enterprise cloud contracts.'
  }
};

function initCalculator() {
  const tierBtns = document.querySelectorAll('.tier-btn');
  const elGpu = document.getElementById('calc-gpu');
  const elGpuDesc = document.getElementById('calc-gpu-desc');
  const elRam = document.getElementById('calc-ram');
  const elRamDesc = document.getElementById('calc-ram-desc');
  const elModels = document.getElementById('calc-models');
  const elModelDesc = document.getElementById('calc-model-desc');
  const elRoi = document.getElementById('calc-roi');
  const elRoiDesc = document.getElementById('calc-roi-desc');

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const tier = btn.getAttribute('data-tier');
      const data = tierData[tier];

      if (data) {
        elGpu.textContent = data.gpu;
        elGpuDesc.textContent = data.gpuDesc;
        elRam.textContent = data.ram;
        elRamDesc.textContent = data.ramDesc;
        elModels.textContent = data.models;
        elModelDesc.textContent = data.modelDesc;
        elRoi.textContent = data.roi;
        elRoiDesc.textContent = data.roiDesc;
      }
    });
  });
}

// ==========================================
// 4. Code Blueprints Vault
// ==========================================
const codeVault = {
  docker: `services:
  # --- 1. LOCAL INFERENCE ENGINE ---
  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    restart: unless-stopped
    ports:
      - "11434:11434"
    volumes:
      - ollama_data:/root/.ollama
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: all
              capabilities: [gpu]

  # --- 2. AI GATEWAY / PROXY ROUTER ---
  litellm:
    image: ghcr.io/berriai/litellm:main-latest
    container_name: litellm
    restart: unless-stopped
    ports:
      - "4000:4000"
    environment:
      - LITELLM_MASTER_KEY=sk-master-ai-server-key
      - DATABASE_URL=sqlite:////data/litellm.db
    volumes:
      - litellm_data:/data
      - ./litellm-config.yaml:/app/config.yaml
    command: ["--config", "/app/config.yaml", "--port", "4000"]
    depends_on:
      - ollama

  # --- 3. VECTOR DATABASE FOR RAG ---
  qdrant:
    image: qdrant/qdrant:latest
    container_name: qdrant
    restart: unless-stopped
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  # --- 4. MULTI-USER CHAT & RAG UI ---
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    container_name: open-webui
    restart: unless-stopped
    ports:
      - "3000:8080"
    environment:
      - OPENAI_API_BASE_URL=http://litellm:4000/v1
      - OPENAI_API_KEY=sk-master-ai-server-key
    volumes:
      - openwebui_data:/app/backend/data
    depends_on:
      - litellm

volumes:
  ollama_data:
  litellm_data:
  qdrant_data:
  openwebui_data:`,

  litellm: `model_list:
  # Main Coding & Agent Model
  - model_name: qwen2.5-coder
    litellm_params:
      model: ollama/qwen2.5-coder:14b
      api_base: http://ollama:11434

  # Deep Reasoning Model
  - model_name: deepseek-r1
    litellm_params:
      model: ollama/deepseek-r1:14b
      api_base: http://ollama:11434

  # High-Performance Multilingual Embedder
  - model_name: text-embedding-bge
    litellm_params:
      model: ollama/bge-m3
      api_base: http://ollama:11434`,

  langgraph: `from typing import Annotated, Literal
from typing_extensions import TypedDict
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode

# Connect to local AI Server OpenAI-compatible endpoint
llm = ChatOpenAI(
    model="qwen2.5-coder",
    base_url="http://localhost:4000/v1",
    api_key="sk-master-ai-server-key",
    temperature=0.1
)

@tool
def calculate_expression(expression: str) -> str:
    """Useful for mathematical evaluations."""
    try:
        return str(eval(expression))
    except Exception as e:
        return f"Error: {e}"

tools = [calculate_expression]
llm_with_tools = llm.bind_tools(tools)

class AgentState(TypedDict):
    messages: Annotated[list, add_messages]

def agent_node(state: AgentState):
    return {"messages": [llm_with_tools.invoke(state["messages"])]}

tool_node = ToolNode(tools)

def should_continue(state: AgentState) -> Literal["tools", END]:
    if state["messages"][-1].tool_calls:
        return "tools"
    return END

# Build Graph
builder = StateGraph(AgentState)
builder.add_node("agent", agent_node)
builder.add_node("tools", tool_node)
builder.add_edge(START, "agent")
builder.add_conditional_edges("agent", should_continue, ["tools", END])
builder.add_edge("tools", "agent")

app = builder.compile()`
};

function initCodeSnippets() {
  const codeTabs = document.querySelectorAll('.code-tab-btn');
  const codeEl = document.getElementById('code-snippet');

  function setCode(key) {
    if (codeVault[key] && codeEl) {
      codeEl.textContent = codeVault[key];
    }
  }

  setCode('docker');

  codeTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      codeTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      setCode(tab.getAttribute('data-code'));
    });
  });
}

// Global copy helper
window.copyCode = function(button) {
  const pre = button.closest('.code-box')?.querySelector('code') || 
              button.closest('.code-tabs-wrapper')?.querySelector('code');
  if (pre) {
    navigator.clipboard.writeText(pre.textContent).then(() => {
      const orig = button.textContent;
      button.textContent = 'Copied!';
      setTimeout(() => button.textContent = orig, 2000);
    });
  }
};
