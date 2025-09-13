import { NextRequest, NextResponse } from 'next/server'

const mockProfiles: Record<string, any> = {
  'ci_77': {
    id: 'ci_77',
    name: 'PT Transportindo',
    legalRegistry: {
      ahu: 'AHU-2025-XY123',
      oss: 'OSS-8891'
    },
    incorporationDate: '2015-04-12',
    sector: 'Logistics',
    hqAddress: 'Jl. Sudirman No. 45, Jakarta',
    ubo: [
      { id: 'pers_102', name: 'Rizal F.', ownership: 0.6 },
      { id: 'pers_103', name: 'Siti M.', ownership: 0.25 },
      { id: 'pers_104', name: 'Ahmad K.', ownership: 0.15 }
    ],
    riskScore: 0.58,
    riskLevel: 'Medium'
  },
  'ci_88': {
    id: 'ci_88',
    name: 'PT Cargo Indo',
    legalRegistry: {
      ahu: 'AHU-2025-XY456',
      oss: 'OSS-8892'
    },
    incorporationDate: '2018-07-22',
    sector: 'Logistics',
    hqAddress: 'Jl. Gatot Subroto No. 12, Jakarta',
    ubo: [
      { id: 'pers_102', name: 'Rizal F.', ownership: 0.45 },
      { id: 'pers_105', name: 'Budi S.', ownership: 0.55 }
    ],
    riskScore: 0.35,
    riskLevel: 'Low'
  },
  'ci_89': {
    id: 'ci_89',
    name: 'PT Tech Innovasi',
    legalRegistry: {
      ahu: 'AHU-2025-XY789',
      oss: 'OSS-8893'
    },
    incorporationDate: '2020-01-15',
    sector: 'Technology',
    hqAddress: 'Jl. HR Rasuna Said, Jakarta',
    ubo: [
      { id: 'pers_106', name: 'David L.', ownership: 0.7 },
      { id: 'pers_107', name: 'Sarah W.', ownership: 0.3 }
    ],
    riskScore: 0.72,
    riskLevel: 'High'
  },
  'ci_90': {
    id: 'ci_90',
    name: 'PT Logistics Solutions',
    legalRegistry: {
      ahu: 'AHU-2025-LS001',
      oss: 'OSS-9001'
    },
    incorporationDate: '2012-03-20',
    sector: 'Logistics',
    hqAddress: 'Jl. Tunjungan No. 77, Surabaya',
    ubo: [
      { id: 'pers_108', name: 'Hendra W.', ownership: 0.5 },
      { id: 'pers_109', name: 'Dewi S.', ownership: 0.5 }
    ],
    riskScore: 0.28,
    riskLevel: 'Low'
  },
  'ci_91': {
    id: 'ci_91',
    name: 'PT Express Delivery',
    legalRegistry: {
      ahu: 'AHU-2025-ED002',
      oss: 'OSS-9002'
    },
    incorporationDate: '2017-11-08',
    sector: 'Logistics',
    hqAddress: 'Jl. Asia Afrika No. 99, Bandung',
    ubo: [
      { id: 'pers_110', name: 'Andi P.', ownership: 0.8 },
      { id: 'pers_111', name: 'Maya R.', ownership: 0.2 }
    ],
    riskScore: 0.45,
    riskLevel: 'Medium'
  },
  'ci_92': {
    id: 'ci_92',
    name: 'PT Shipping Lines',
    legalRegistry: {
      ahu: 'AHU-2025-SL003',
      oss: 'OSS-9003'
    },
    incorporationDate: '2010-06-15',
    sector: 'Maritime',
    hqAddress: 'Jl. Tanjung Priok No. 1, Jakarta',
    ubo: [
      { id: 'pers_112', name: 'Captain Surya', ownership: 0.4 },
      { id: 'pers_113', name: 'Linda T.', ownership: 0.6 }
    ],
    riskScore: 0.68,
    riskLevel: 'High'
  },
  'ci_93': {
    id: 'ci_93',
    name: 'PT Digital Solutions',
    legalRegistry: {
      ahu: 'AHU-2025-DS004',
      oss: 'OSS-9004'
    },
    incorporationDate: '2019-02-28',
    sector: 'Technology',
    hqAddress: 'Jl. Kemang Raya No. 55, Jakarta',
    ubo: [
      { id: 'pers_114', name: 'Steve H.', ownership: 0.6 },
      { id: 'pers_115', name: 'Rina K.', ownership: 0.4 }
    ],
    riskScore: 0.22,
    riskLevel: 'Low'
  },
  'ci_94': {
    id: 'ci_94',
    name: 'PT Cloud Services',
    legalRegistry: {
      ahu: 'AHU-2025-CS005',
      oss: 'OSS-9005'
    },
    incorporationDate: '2018-09-10',
    sector: 'Technology',
    hqAddress: 'Jl. TB Simatupang No. 88, Jakarta',
    ubo: [
      { id: 'pers_116', name: 'Kevin L.', ownership: 0.7 },
      { id: 'pers_117', name: 'Sinta M.', ownership: 0.3 }
    ],
    riskScore: 0.51,
    riskLevel: 'Medium'
  },
  'ci_95': {
    id: 'ci_95',
    name: 'PT Mining Resources',
    legalRegistry: {
      ahu: 'AHU-2025-MR006',
      oss: 'OSS-9006'
    },
    incorporationDate: '2008-05-12',
    sector: 'Mining',
    hqAddress: 'Jl. Tambang No. 1, Balikpapan',
    ubo: [
      { id: 'pers_118', name: 'Hartono B.', ownership: 0.55 },
      { id: 'pers_119', name: 'Wijaya S.', ownership: 0.45 }
    ],
    riskScore: 0.76,
    riskLevel: 'High'
  },
  'ci_96': {
    id: 'ci_96',
    name: 'PT Energy Bersama',
    legalRegistry: {
      ahu: 'AHU-2025-EB007',
      oss: 'OSS-9007'
    },
    incorporationDate: '2011-10-30',
    sector: 'Energy',
    hqAddress: 'Jl. Energi No. 77, Jakarta',
    ubo: [
      { id: 'pers_120', name: 'Robert T.', ownership: 0.6 },
      { id: 'pers_121', name: 'Indah P.', ownership: 0.4 }
    ],
    riskScore: 0.54,
    riskLevel: 'Medium'
  },
  'ci_97': {
    id: 'ci_97',
    name: 'PT Construction Prima',
    legalRegistry: {
      ahu: 'AHU-2025-CP008',
      oss: 'OSS-9008'
    },
    incorporationDate: '2009-07-18',
    sector: 'Construction',
    hqAddress: 'Jl. Konstruksi No. 45, Jakarta',
    ubo: [
      { id: 'pers_122', name: 'Bambang K.', ownership: 0.7 },
      { id: 'pers_123', name: 'Yanti S.', ownership: 0.3 }
    ],
    riskScore: 0.69,
    riskLevel: 'High'
  },
  'ci_98': {
    id: 'ci_98',
    name: 'PT Food Industries',
    legalRegistry: {
      ahu: 'AHU-2025-FI009',
      oss: 'OSS-9009'
    },
    incorporationDate: '2014-12-05',
    sector: 'Food & Beverage',
    hqAddress: 'Jl. Industri No. 88, Surabaya',
    ubo: [
      { id: 'pers_124', name: 'Chef Anton', ownership: 0.5 },
      { id: 'pers_125', name: 'Maria L.', ownership: 0.5 }
    ],
    riskScore: 0.31,
    riskLevel: 'Low'
  },
  'ci_99': {
    id: 'ci_99',
    name: 'PT Retail Networks',
    legalRegistry: {
      ahu: 'AHU-2025-RN010',
      oss: 'OSS-9010'
    },
    incorporationDate: '2013-04-22',
    sector: 'Retail',
    hqAddress: 'Jl. Shopping No. 100, Jakarta',
    ubo: [
      { id: 'pers_126', name: 'Diana R.', ownership: 0.6 },
      { id: 'pers_127', name: 'Faisal A.', ownership: 0.4 }
    ],
    riskScore: 0.47,
    riskLevel: 'Medium'
  },
  'ci_100': {
    id: 'ci_100',
    name: 'PT Healthcare Systems',
    legalRegistry: {
      ahu: 'AHU-2025-HS011',
      oss: 'OSS-9011'
    },
    incorporationDate: '2016-08-14',
    sector: 'Healthcare',
    hqAddress: 'Jl. Kesehatan No. 50, Jakarta',
    ubo: [
      { id: 'pers_128', name: 'Dr. Sutomo', ownership: 0.7 },
      { id: 'pers_129', name: 'Nurse Sari', ownership: 0.3 }
    ],
    riskScore: 0.25,
    riskLevel: 'Low'
  },
  'ci_101': {
    id: 'ci_101',
    name: 'PT Finance Corp',
    legalRegistry: {
      ahu: 'AHU-2025-FC012',
      oss: 'OSS-9012'
    },
    incorporationDate: '2007-01-25',
    sector: 'Financial Services',
    hqAddress: 'Jl. Keuangan No. 1, Jakarta',
    ubo: [
      { id: 'pers_130', name: 'William C.', ownership: 0.8 },
      { id: 'pers_131', name: 'Ratna D.', ownership: 0.2 }
    ],
    riskScore: 0.71,
    riskLevel: 'High'
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const companyId = searchParams.get('companyId')

  if (!companyId) {
    return NextResponse.json({ error: 'Company ID is required' }, { status: 400 })
  }

  const profile = mockProfiles[companyId]
  
  if (!profile) {
    return NextResponse.json({ error: 'Company not found' }, { status: 404 })
  }

  return NextResponse.json(profile)
}