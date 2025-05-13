// Define types for votes
type VoteType = "based" | "cringe"

interface VoteData {
  mediaId: string
  voteType: VoteType
  timestamp: number
  userId?: string // For when we implement authentication
}

class VotingService {
  private static instance: VotingService
  private voteLog: VoteData[] = []

  // Singleton pattern
  public static getInstance(): VotingService {
    if (!VotingService.instance) {
      VotingService.instance = new VotingService()
    }
    return VotingService.instance
  }

  // Get user votes from localStorage
  public getUserVotes(): Record<string, VoteType> {
    if (typeof window === "undefined") return {}
    const votes = localStorage.getItem("media-votes")
    return votes ? JSON.parse(votes) : {}
  }

  // Save a vote
  public saveVote(mediaId: string, voteType: VoteType, userId?: string): void {
    if (typeof window === "undefined") return

    // Update localStorage
    const votes = this.getUserVotes()
    votes[mediaId] = voteType
    localStorage.setItem("media-votes", JSON.stringify(votes))

    // Log the vote
    const voteData: VoteData = {
      mediaId,
      voteType,
      timestamp: Date.now(),
      userId,
    }

    this.voteLog.push(voteData)
    this.persistVoteLog()

    // In a real app, send to server
    // this.sendVoteToServer(voteData)
  }

  // Remove a vote
  public removeVote(mediaId: string, userId?: string): void {
    if (typeof window === "undefined") return

    // Update localStorage
    const votes = this.getUserVotes()
    delete votes[mediaId]
    localStorage.setItem("media-votes", JSON.stringify(votes))

    // Log the removal
    const voteData: VoteData = {
      mediaId,
      voteType: "based", // Placeholder, doesn't matter for removal
      timestamp: Date.now(),
      userId,
    }

    this.voteLog.push({ ...voteData, voteType: "removal" } as any)
    this.persistVoteLog()

    // In a real app, send to server
    // this.sendVoteRemovalToServer(mediaId, userId)
  }

  // Get vote statistics for a media outlet
  public getVoteStats(mediaId: string): { based: number; cringe: number } {
    // In a real app, this would fetch from the server
    // For now, we'll return dummy data
    return {
      based: Math.floor(Math.random() * 1000) + 100,
      cringe: Math.floor(Math.random() * 800) + 50,
    }
  }

  // Get all vote logs (for admin purposes)
  public getVoteLogs(): VoteData[] {
    return this.voteLog
  }

  // Persist vote log to localStorage (in a real app, this would go to a database)
  private persistVoteLog(): void {
    if (typeof window === "undefined") return

    // Keep only the last 1000 votes to prevent localStorage from getting too big
    if (this.voteLog.length > 1000) {
      this.voteLog = this.voteLog.slice(-1000)
    }

    localStorage.setItem("media-vote-log", JSON.stringify(this.voteLog))
  }

  // Load vote log from localStorage
  public loadVoteLog(): void {
    if (typeof window === "undefined") return

    const logData = localStorage.getItem("media-vote-log")
    if (logData) {
      this.voteLog = JSON.parse(logData)
    }
  }

  // In a real app, this would send the vote to a server
  private sendVoteToServer(voteData: VoteData): void {
    // Example implementation
    // fetch('/api/votes', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(voteData)
    // })
    console.log("Vote logged:", voteData)
  }
}

// Export a singleton instance
export const votingService = VotingService.getInstance()

// Initialize vote log when imported
if (typeof window !== "undefined") {
  votingService.loadVoteLog()
}
