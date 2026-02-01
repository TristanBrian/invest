'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ArrowRight } from 'lucide-react'

interface StoryModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function StoryModal({ open, onOpenChange }: StoryModalProps) {
  const [activeTab, setActiveTab] = useState<'story' | 'metrics'>('story')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="mb-6">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl md:text-3xl">The Oxic Story</DialogTitle>
            <button onClick={() => onOpenChange(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-5 w-5" />
            </button>
          </div>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 border-b border-border/30">
          <button
            onClick={() => setActiveTab('story')}
            className={`pb-3 px-2 font-semibold text-sm transition-colors ${
              activeTab === 'story'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Our Journey
          </button>
          <button
            onClick={() => setActiveTab('metrics')}
            className={`pb-3 px-2 font-semibold text-sm transition-colors ${
              activeTab === 'metrics'
                ? 'text-primary border-b-2 border-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Track Record
          </button>
        </div>

        {/* Story Tab */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">Our Vision</h3>
              <p className="text-foreground/70 leading-relaxed">
                The Oxic International Group was founded on a simple belief: global capital flows to opportunity, not geography. We recognized a critical gap in the East African investment ecosystem. The need for trusted, technology-enabled advisors who understand both international investor expectations and local market dynamics.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-3">What We Do</h3>
              <p className="text-foreground/70 leading-relaxed mb-4">
                We bridge the gap between global capital and African opportunity. Our end-to-end investor liaison services combine deep local market intelligence with cutting-edge technology execution, enabling international investors to confidently enter, scale, and maximize returns across Kenya and East Africa.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-primary mb-4">Our Competitive Advantages</h3>
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Deep Local Expertise</h4>
                    <p className="text-sm text-foreground/70">15+ years combined experience navigating East African markets. Our team understands regulatory landscapes, market dynamics, and investment nuances across multiple sectors.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Technology-Enabled Execution</h4>
                    <p className="text-sm text-foreground/70">Modern infrastructure and digital tools for seamless, transparent transactions. Real-time tracking, secure payments, and automated documentation reduce friction and accelerate deal closure.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-primary mb-1">Investor-Centric Approach</h4>
                    <p className="text-sm text-foreground/70">We work exclusively for global investors, ensuring complete alignment of interests. Your success and capital preservation are our primary objectives.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Metrics Tab */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50+</div>
                <p className="text-xs md:text-sm text-foreground/70">Successful Transactions</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">$500M+</div>
                <p className="text-xs md:text-sm text-foreground/70">Capital Deployed</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">15+</div>
                <p className="text-xs md:text-sm text-foreground/70">Countries Networked</p>
              </div>

              <div className="bg-primary/5 rounded-xl p-4 border border-primary/10 hover:border-primary/20 transition-colors text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary mb-1">24/7</div>
                <p className="text-xs md:text-sm text-foreground/70">Dedicated Support</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20 rounded-lg p-6">
              <h4 className="font-semibold text-primary mb-3">Investment Thesis</h4>
              <ul className="space-y-2 text-sm text-foreground/70">
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Average deal closure time reduced by 60% vs. traditional advisors</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Zero transaction failure rate due to due diligence quality</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-primary font-bold">•</span>
                  <span>Client retention rate of 95%+ with repeat investments averaging 3x initial commitment</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="mt-8 pt-6 border-t border-border/30">
          <Button className="w-full bg-primary hover:bg-primary/90 h-11 font-semibold" onClick={() => onOpenChange(false)}>
            Ready to Explore <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
