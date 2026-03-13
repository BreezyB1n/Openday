// lib/score-match.ts
// Compares user profile scores against program requirements.

export type MatchResult = 'pass' | 'fail' | 'unknown'

export type ScoreMatch = {
  label: string       // e.g. "GPA" or "IELTS"
  required: string    // display string of requirement
  mine: string        // display string of user score or "未填写"
  result: MatchResult
}

// GPA: Program.gpaReq (number | null) vs UserProfile.gpa (string)
export function matchGpa(
  gpaReq: number | null,
  userGpa: string | undefined
): ScoreMatch {
  if (gpaReq === null) return { label: 'GPA', required: '—', mine: userGpa || '未填写', result: 'unknown' }
  const mine = parseFloat(userGpa ?? '')
  if (isNaN(mine)) return { label: 'GPA', required: String(gpaReq), mine: userGpa || '未填写', result: 'unknown' }
  return {
    label: 'GPA',
    required: String(gpaReq),
    mine: String(mine),
    result: mine >= gpaReq ? 'pass' : 'fail',
  }
}

// Language: Program.languageReq (string | null) vs UserProfile.ielts/toefl
export function matchLanguage(
  langReq: string | null,
  profile: { ielts?: string; toefl?: string }
): ScoreMatch {
  if (!langReq) return { label: 'LANGUAGE', required: '—', mine: '—', result: 'unknown' }

  const upper = langReq.toUpperCase()

  // Try IELTS branch if requirement mentions IELTS AND user has an ielts score
  if (upper.includes('IELTS') && profile.ielts) {
    const reqMatch = langReq.match(/IELTS\s*([\d.]+)/i)
    const req = reqMatch ? parseFloat(reqMatch[1]) : NaN
    const mine = parseFloat(profile.ielts)
    if (!isNaN(req) && !isNaN(mine)) {
      return { label: 'IELTS', required: String(req), mine: String(mine), result: mine >= req ? 'pass' : 'fail' }
    }
  }

  // Try TOEFL branch if requirement mentions TOEFL AND user has a toefl score
  if (upper.includes('TOEFL') && profile.toefl) {
    const reqMatch = langReq.match(/TOEFL\s*([\d.]+)/i)
    const req = reqMatch ? parseFloat(reqMatch[1]) : NaN
    const mine = parseFloat(profile.toefl)
    if (!isNaN(req) && !isNaN(mine)) {
      return { label: 'TOEFL', required: String(req), mine: String(mine), result: mine >= req ? 'pass' : 'fail' }
    }
  }

  // Neither branch matched — show raw requirement, no verdict
  const reqLabel = upper.includes('IELTS') ? 'IELTS' : upper.includes('TOEFL') ? 'TOEFL' : 'LANGUAGE'
  const userScore = profile.ielts || profile.toefl || '未填写'
  const result: MatchResult = (profile.ielts || profile.toefl) ? 'unknown' : 'fail'
  return { label: reqLabel, required: langReq, mine: userScore, result }
}
