import json, random, re
from datetime import datetime, timedelta

# Set seed for reproducible content
random.seed(42)

# 30 trending technical topics across different domains
topics = [
    # GenAI & LLMs (8 articles)
    "Building Production-Ready RAG Systems with Vector Databases",
    "Fine-Tuning Large Language Models with LoRA and QLoRA", 
    "Prompt Engineering Best Practices for Enterprise Applications",
    "Implementing AI Guardrails and Content Safety Filters",
    "Vector Embeddings and Semantic Search Implementation",
    "AI Agent Architectures: Planning and Tool Integration",
    "Cost Optimization Strategies for LLM Inference",
    "Multimodal AI: Combining Text, Images, and Audio Processing",
    
    # Web Development (8 articles)
    "Next.js 15 App Router and Server Components Deep Dive",
    "Building Scalable React Applications with Suspense",
    "Modern CSS: Container Queries and CSS Grid Mastery", 
    "TypeScript 5.x Advanced Features and Performance",
    "Web Performance Optimization: Core Web Vitals 2025",
    "Progressive Web Apps: Offline-First Architecture",
    "WebAssembly Integration in Modern Web Applications",
    "Micro-Frontends: Architecture Patterns and Pitfalls",
    
    # Testing (6 articles)
    "Test-Driven Development in Modern JavaScript Frameworks",
    "End-to-End Testing with Playwright and Cypress",
    "API Testing Strategies: Contract Testing with Pact",
    "Performance Testing with K6 and Load Impact", 
    "Visual Regression Testing for Frontend Applications",
    "Mutation Testing: Improving Test Suite Quality",
    
    # DevOps & Infrastructure (5 articles)
    "Kubernetes Security: Pod Security Standards Implementation",
    "CI/CD Pipeline Optimization with GitHub Actions",
    "Infrastructure as Code: Terraform vs Pulumi Comparison",
    "Monitoring and Observability with OpenTelemetry",
    "Serverless Functions: Cold Start Optimization",
    
    # Security & Backend (3 articles)
    "Zero Trust Architecture Implementation Guide",
    "API Security: OWASP Top 10 Prevention Strategies", 
    "Microservices Architecture: Event-Driven Design Patterns"
]

# Author pool with expertise areas
authors = [
    "Sarah Chen", "Alex Thompson", "Mike Rodriguez", "Priya Nair", "Liam O'Connor",
    "Zoe Park", "Amir Haddad", "Nina Petrov", "Diego Alvarez", "Hannah Müller",
    "Tomasz Kowalski", "Aisha Khan", "Kenji Sato", "Elena Garcia", "Jonas Weber"
]

def slugify(title):
    """Convert title to URL-friendly slug"""
    s = title.lower()
    s = re.sub(r"[^a-z0-9\s-]", "", s)
    s = re.sub(r"\s+", "-", s)
    s = re.sub(r"-+", "-", s)
    return s.strip('-')

def determine_category(title):
    """Determine article category based on title keywords"""
    title_lower = title.lower()
    
    if any(word in title_lower for word in ['ai', 'llm', 'rag', 'prompt', 'vector', 'embeddings', 'agent', 'multimodal']):
        return "AI & Machine Learning"
    elif any(word in title_lower for word in ['web', 'react', 'css', 'next.js', 'typescript', 'pwa', 'webassembly', 'micro-frontend']):
        return "Web Development"
    elif any(word in title_lower for word in ['test', 'testing', 'tdd', 'playwright', 'cypress', 'pact', 'k6', 'mutation']):
        return "Testing"
    elif any(word in title_lower for word in ['kubernetes', 'ci/cd', 'terraform', 'pulumi', 'observability', 'serverless']):
        return "DevOps"
    elif any(word in title_lower for word in ['security', 'zero trust', 'api security', 'owasp']):
        return "Security"
    else:
        return "Software Architecture"

def generate_tags(title):
    """Generate relevant tags based on title"""
    title_lower = title.lower()
    all_tags = []
    
    # Technology-specific tags
    if 'react' in title_lower: all_tags.extend(['react', 'frontend'])
    if 'next.js' in title_lower: all_tags.extend(['nextjs', 'ssr'])
    if 'typescript' in title_lower: all_tags.extend(['typescript', 'javascript'])
    if 'kubernetes' in title_lower: all_tags.extend(['kubernetes', 'devops'])
    if 'ai' in title_lower or 'llm' in title_lower: all_tags.extend(['ai', 'machine-learning'])
    if 'testing' in title_lower: all_tags.extend(['testing', 'qa'])
    if 'security' in title_lower: all_tags.extend(['security', 'cybersecurity'])
    if 'performance' in title_lower: all_tags.extend(['performance', 'optimization'])
    if 'css' in title_lower: all_tags.extend(['css', 'frontend'])
    if 'api' in title_lower: all_tags.extend(['api', 'backend'])
    
    # Generic fallback
    if not all_tags:
        all_tags = ['programming', 'software-development']
    
    return list(set(all_tags))[:4]  # Return max 4 unique tags

def generate_technical_content(title):
    """Generate realistic 200-word technical article content"""
    
    # Create topic-specific content based on title keywords
    title_lower = title.lower()
    
    # Introduction paragraph based on topic
    if 'ai' in title_lower or 'llm' in title_lower or 'rag' in title_lower:
        intro = f"{title} represents a breakthrough in artificial intelligence applications, enabling organizations to harness the power of large language models for practical business solutions. The rapid evolution of AI technologies has created new opportunities for intelligent automation and enhanced user experiences."
    elif 'react' in title_lower or 'next.js' in title_lower or 'web' in title_lower:
        intro = f"Modern web development with {title.lower()} has transformed how we build interactive, performant applications. Understanding these technologies is crucial for delivering exceptional user experiences and maintaining competitive advantages in today's digital landscape."
    elif 'test' in title_lower or 'testing' in title_lower:
        intro = f"Quality assurance through {title.lower()} ensures reliable software delivery and reduces production incidents. Comprehensive testing strategies have become essential for maintaining code quality and user satisfaction in complex applications."
    elif 'kubernetes' in title_lower or 'devops' in title_lower or 'ci/cd' in title_lower:
        intro = f"Implementing {title.lower()} streamlines development workflows and improves deployment reliability. Modern DevOps practices enable teams to deliver features faster while maintaining system stability and security."
    elif 'security' in title_lower:
        intro = f"Security-first approaches to {title.lower()} protect applications against evolving threats and sophisticated attack vectors. Organizations must prioritize robust security measures to safeguard sensitive data and maintain user trust."
    else:
        intro = f"{title} has emerged as a critical component in modern software architecture, addressing key challenges in scalability, maintainability, and system reliability."
    
    # Main technical content
    main_content = """The implementation requires careful consideration of architecture patterns, performance optimization, and scalability requirements. Key decisions involve selecting appropriate frameworks, designing efficient algorithms, and establishing robust error handling mechanisms.

Production deployment demands comprehensive testing methodologies, including unit tests, integration scenarios, and end-to-end validation. Monitoring infrastructure provides essential insights through structured logging, distributed tracing, and real-time performance metrics.

Best practices emphasize following established coding standards, maintaining thorough documentation, and implementing automated CI/CD pipelines. Regular code reviews and collaborative development processes ensure knowledge sharing while maintaining high-quality deliverables."""
    
    # Conclusion
    conclusion = "Successful adoption requires incremental implementation, continuous evaluation, and iterative refinement based on production feedback and evolving business requirements."
    
    # Combine all parts
    full_content = f"{intro}\n\n{main_content}\n\n{conclusion}"
    
    # Ensure approximately 200 words (180-220 range)
    words = full_content.split()
    if len(words) > 220:
        # Trim to 200 words
        full_content = ' '.join(words[:200])
    elif len(words) < 180:
        # Add more content to reach ~200 words
        additional = " Modern tooling and community resources provide extensive support for implementation, with comprehensive documentation and active developer communities contributing to ongoing improvements and innovation."
        full_content += additional
    
    return full_content

# Generate 30 articles
articles = []
start_date = datetime(2025, 10, 16)

for idx, title in enumerate(topics, start=1):
    author = random.choice(authors)
    # Distribute dates over the past 30 days
    date = (start_date - timedelta(days=random.randint(0, 30))).strftime('%Y-%m-%d')
    content = generate_technical_content(title)
    
    # Create excerpt from first 30 words
    words = content.split()
    excerpt = ' '.join(words[:30]) + ('...' if len(words) > 30 else '')
    
    articles.append({
        "id": idx,
        "title": title,
        "author": author,
        "date": date,
        "slug": slugify(title),
        "excerpt": excerpt,
        "content": content,
        "category": determine_category(title),
        "readTime": "3 min read",
        "tags": generate_tags(title)
    })

# Create data directory and save articles
import os
os.makedirs('data', exist_ok=True)

articles_data = {
    "meta": {
        "total": len(articles),
        "generated": datetime.now().isoformat(),
        "version": "1.0.0",
        "description": "ByteToBeacon technical articles covering software development, AI, web development, testing, and DevOps"
    },
    "articles": articles
}

with open('data/articles.json', 'w', encoding='utf-8') as f:
    json.dump(articles_data, f, ensure_ascii=False, indent=2)

print(f"✅ Generated {len(articles)} technical articles")
print(f"📊 Categories: {len(set(article['category'] for article in articles))} unique categories") 
print(f"📝 Average word count: {sum(len(article['content'].split()) for article in articles) // len(articles)} words")
print("📄 Saved to data/articles.json")

# Show stats by category
category_stats = {}
for article in articles:
    cat = article['category']
    category_stats[cat] = category_stats.get(cat, 0) + 1

print(f"\n📊 Articles by Category:")
for category, count in sorted(category_stats.items()):
    print(f"  {category}: {count} articles")

# Show sample article details
sample = articles[0]
print(f"\n📖 Sample Article:")
print(f"Title: {sample['title']}")
print(f"Author: {sample['author']}")
print(f"Category: {sample['category']}")
print(f"Tags: {', '.join(sample['tags'])}")
print(f"Word count: {len(sample['content'].split())} words")
print(f"Excerpt: {sample['excerpt']}")
print(f"Content preview: {sample['content'][:100]}...")