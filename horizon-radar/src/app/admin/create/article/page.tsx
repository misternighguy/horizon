'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { EyeIcon, EyeSlashIcon, PlusIcon, TrashIcon } from '@heroicons/react/24/outline';
import { localStorageDB } from '@/data/localStorageDB';
import ReactCrop, { Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

type ReadingLevel = 'novice' | 'technical' | 'analyst';

interface DraftArticle {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

interface TestArticle {
  id: string;
  title?: string;
  projectName?: string;
  ticker?: string;
  [key: string]: unknown;
}

// SectionState interface removed - now using separate states for visibility and synchronization

interface ArticleFormData {
  id: string;
  title: string;
  slug: string;
  // Basic Info
  projectName: string;
  ticker: string;
  category: string[];
  chains: string[];
  status: string;
  premium: boolean;
  
  // Image Banner
  featuredImage?: string;
  
  // Inter-Text Images
  interTextImages: Array<{
    id: string;
    title: string;
    imageUrl: string;
    aspectRatio: string;
    caption?: string;
    width: number;
    height: number;
  }>;
  
  // Content Sections
  tldr: Record<ReadingLevel, string>;
  abstract: Record<ReadingLevel, string>;
  architecture: Record<ReadingLevel, string>;
  mechanics: Record<ReadingLevel, string>;
  problemUsersValue: Record<ReadingLevel, string>;
  tokenomics: Record<ReadingLevel, string>;
  authorSources: Record<ReadingLevel, string>;
  disclaimer: Record<ReadingLevel, string>;
  community: Record<ReadingLevel, string>;
  
  // Article Sidebar Data
  radarRating: {
    growthPotential: number;
    investmentOpportunity: number;
    memberOpinions: number;
  };
  notableStats: Array<{
    id: string;
    title: string;
    value: string;
  }>;
  tokenomicsData: Array<{
    id: string;
    category: string;
    percentage: number;
    status: 'active' | 'locked' | 'vesting';
  }>;
  
  // Flexible Arrays
  teamMembers: string[];
  officialLinks: string[];
  sources: string[];
  
  // Custom Sections
  customSections: Array<{
    id: string;
    title: string;
    content: Record<ReadingLevel, string>;
    visible: boolean;
  }>;
  
  // Table of Contents
  tableOfContents: string[];
  
  // Metadata
  lastModified: string;
  excerpt: string;
}

function CreateArticlePageContent() {
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const [currentLevel, setCurrentLevel] = useState<ReadingLevel>('novice');
  const [isEditing, setIsEditing] = useState(false);
  
  // Load existing article data if editing
  useEffect(() => {
    if (editId) {
      const articles = localStorageDB.getArticles();
      const existingArticle = articles.find(article => article.id === editId);
      if (existingArticle) {
        console.log('Loading existing article:', existingArticle);
        setIsEditing(true);
        // Convert existing article to form data format
        setFormData({
          id: existingArticle.id,
          title: existingArticle.title || '',
          slug: existingArticle.slug || '',
          projectName: existingArticle.title || '', // Use title as project name
          ticker: existingArticle.ticker || '',
          category: existingArticle.ecosystem || [''],
          chains: existingArticle.location ? [existingArticle.location] : [''],
          status: existingArticle.status || '',
          premium: false, // Default value
          tldr: { novice: '', technical: '', analyst: '' }, // Default empty
          abstract: { 
            novice: existingArticle.abstract?.[0] || '', 
            technical: existingArticle.abstract?.[1] || '', 
            analyst: existingArticle.abstract?.[2] || '' 
          },
          architecture: { 
            novice: existingArticle.productArchitecture?.sections?.[0] || '', 
            technical: existingArticle.productArchitecture?.sections?.[1] || '', 
            analyst: existingArticle.productArchitecture?.sections?.[2] || '' 
          },
          mechanics: { 
            novice: existingArticle.mechanics?.[0] || '', 
            technical: existingArticle.mechanics?.[1] || '', 
            analyst: existingArticle.mechanics?.[2] || '' 
          },
          problemUsersValue: { 
            novice: existingArticle.problemUsersValue?.problem || '', 
            technical: existingArticle.problemUsersValue?.approach || '', 
            analyst: existingArticle.problemUsersValue?.differentiators?.join(', ') || '' 
          },
          tokenomics: { novice: '', technical: '', analyst: '' }, // Default empty
          authorSources: { novice: '', technical: '', analyst: '' }, // Default empty
          disclaimer: { novice: '', technical: '', analyst: '' }, // Default empty
          community: { novice: '', technical: '', analyst: '' }, // Default empty
          radarRating: {
            growthPotential: existingArticle.radarRating?.growthPotential || 0,
            investmentOpportunity: existingArticle.radarRating?.investmentOpportunity || 0,
            memberOpinions: existingArticle.radarRating?.memberOpinions || 0
          },
          notableStats: existingArticle.stats ? [
            { id: '1', title: 'TVL', value: existingArticle.stats.tvl || '' },
            { id: '2', title: '24h Volume', value: existingArticle.stats.volume || '' },
            { id: '3', title: 'Users', value: existingArticle.stats.users || '' },
            { id: '4', title: 'Capital Raised', value: existingArticle.stats.capital || '' },
            { id: '5', title: 'Opinions', value: existingArticle.stats.opinions || '' }
          ] : [
            { id: '1', title: 'TVL', value: '' },
            { id: '2', title: '24h Volume', value: '' },
            { id: '3', title: 'Users', value: '' },
            { id: '4', title: 'Capital Raised', value: '' },
            { id: '5', title: 'Opinions', value: '' }
          ],
          tokenomicsData: existingArticle.tokenomics ? existingArticle.tokenomics.map((item, index) => ({
            id: `tokenomics-${index}`,
            category: item.category || '',
            percentage: item.percentage || 0,
            status: (item.status === 'good' || item.status === 'neutral' || item.status === 'bad') ? 'active' : 'active'
          })) : [
            { id: 'tokenomics-1', category: 'Liquidity', percentage: 0, status: 'active' as const },
            { id: 'tokenomics-2', category: 'Team', percentage: 0, status: 'active' as const },
            { id: 'tokenomics-3', category: 'Community', percentage: 0, status: 'active' as const }
          ],
          teamMembers: existingArticle.team?.map(member => member.name) || [''],
          officialLinks: existingArticle.officialLinks?.socials?.map(social => social.url) || [''],
          sources: existingArticle.credentials || [''],
          customSections: [], // Default empty
          tableOfContents: existingArticle.tableOfContents || [
            'Abstract',
            'Architecture',
            'Mechanics',
            'Problem, Users & Value',
            'Tokenomics',
            'Team',
            'Sources',
            'Disclaimer',
            'Community'
          ],
          lastModified: existingArticle.updatedAt ? 
            (typeof existingArticle.updatedAt === 'string' ? existingArticle.updatedAt : existingArticle.updatedAt.toISOString()) 
            : new Date().toISOString(),
          excerpt: existingArticle.subtitle || '',
          featuredImage: existingArticle.featuredImage || undefined,
          interTextImages: existingArticle.interTextImages || []
        });
        // Set image preview if banner image exists
        if (existingArticle.featuredImage) {
          setImagePreview(existingArticle.featuredImage);
        }
      }
    }
  }, [editId]);
  
  const [formData, setFormData] = useState<ArticleFormData>({
    id: `article-${Date.now()}`,
    title: '',
    slug: '',
    projectName: '',
    ticker: '',
    category: [''],
    chains: [''],
    status: '',
    premium: false,
    tldr: { novice: '', technical: '', analyst: '' },
    abstract: { novice: '', technical: '', analyst: '' },
    architecture: { novice: '', technical: '', analyst: '' },
    mechanics: { novice: '', technical: '', analyst: '' },
    problemUsersValue: { novice: '', technical: '', analyst: '' },
    tokenomics: { novice: '', technical: '', analyst: '' },
    authorSources: { novice: '', technical: '', analyst: '' },
    disclaimer: { novice: '', technical: '', analyst: '' },
    community: { novice: '', technical: '', analyst: '' },
    radarRating: {
      growthPotential: 0,
      investmentOpportunity: 0,
      memberOpinions: 0
    },
    notableStats: [
      { id: '1', title: 'TVL', value: '' },
      { id: '2', title: '24h Volume', value: '' },
      { id: '3', title: 'Users', value: '' },
      { id: '4', title: 'Capital Raised', value: '' },
      { id: '5', title: 'Opinions', value: '' }
    ],
    tokenomicsData: [
      { id: 'tokenomics-1', category: 'Liquidity', percentage: 0, status: 'active' as const },
      { id: 'tokenomics-2', category: 'Team', percentage: 0, status: 'active' as const },
      { id: 'tokenomics-3', category: 'Community', percentage: 0, status: 'active' as const }
    ],
    teamMembers: [''],
    officialLinks: [''],
    sources: [''],
    customSections: [],
    tableOfContents: [
      'Abstract',
      'Architecture',
      'Mechanics',
      'Problem, Users & Value',
      'Tokenomics',
      'Team',
      'Sources',
      'Disclaimer',
      'Community'
    ],
    lastModified: new Date().toISOString(),
    excerpt: '',
    featuredImage: undefined,
    interTextImages: []
  });

  const [sectionStates, setSectionStates] = useState<Record<string, Record<ReadingLevel, boolean>>>({
          tldr: { novice: true, technical: true, analyst: true },
      abstract: { novice: true, technical: true, analyst: true },
      architecture: { novice: true, technical: true, analyst: true },
      mechanics: { novice: true, technical: true, analyst: true },
      problemUsersValue: { novice: true, technical: true, analyst: true },
      tokenomics: { novice: true, technical: true, analyst: true },
      authorSources: { novice: true, technical: true, analyst: true },
      disclaimer: { novice: true, technical: true, analyst: true },
      community: { novice: true, technical: true, analyst: true },
  });

  const [synchronizedSections, setSynchronizedSections] = useState<Record<string, boolean>>({
    tldr: false,
    abstract: false,
    architecture: false,
    mechanics: false,
    problemUsersValue: false,
    tokenomics: false,
    authorSources: false,
    disclaimer: false,
    community: false,
  });

  // Image upload state
  const [isDragOver, setIsDragOver] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [showCrop, setShowCrop] = useState(false);
  const [crop, setCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Inter-text images state
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageData, setCurrentImageData] = useState<{
    title: string;
    aspectRatio: string;
    caption: string;
  }>({
    title: '',
    aspectRatio: '16:9',
    caption: ''
  });
  const [interTextCrop, setInterTextCrop] = useState<Crop>({
    unit: '%',
    width: 100,
    height: 100,
    x: 0,
    y: 0
  });
  const [interTextOriginalImage, setInterTextOriginalImage] = useState<string | null>(null);
  const interTextImgRef = useRef<HTMLImageElement>(null);

  const toggleSectionVisibility = (section: string, level: ReadingLevel) => {
    setSectionStates(prev => ({
      ...prev,
      [section]: { ...prev[section], [level]: !prev[section][level] }
    }));
  };

  const syncFromAdvanced = (section: string) => {
    if (formData[section as keyof ArticleFormData] && typeof formData[section as keyof ArticleFormData] === 'object') {
      const sectionData = formData[section as keyof ArticleFormData] as Record<ReadingLevel, string>;
      if (sectionData.analyst) {
        setFormData(prev => ({
          ...prev,
          [section]: {
            ...sectionData,
            novice: sectionData.analyst,
            technical: sectionData.analyst
          }
        }));
        // Enable synchronization after syncing
        setSynchronizedSections(prev => ({
          ...prev,
          [section]: true
        }));
      }
    }
  };

  const untetherSynchronization = (section: string) => {
    setSynchronizedSections(prev => ({
      ...prev,
      [section]: false
    }));
  };

  const addArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: keyof Pick<ArticleFormData, 'teamMembers' | 'officialLinks' | 'sources' | 'category' | 'chains'>, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addCustomSection = () => {
    const newSection = {
      id: `custom-${Date.now()}`,
      title: '',
      content: { novice: '', technical: '', analyst: '' },
      visible: true
    };
    setFormData(prev => ({
      ...prev,
      customSections: [...prev.customSections, newSection]
    }));
  };

  const removeCustomSection = (id: string) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.filter(section => section.id !== id)
    }));
  };

  const updateCustomSection = (id: string, field: string, value: string | Record<ReadingLevel, string> | boolean) => {
    setFormData(prev => ({
      ...prev,
      customSections: prev.customSections.map(section => 
        section.id === id ? { ...section, [field]: value } : section
      )
    }));
  };

  // Image upload functions
  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setOriginalImage(result);
        setShowCrop(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCroppedImg = (image: HTMLImageElement, crop: Crop): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = 1500;
    canvas.height = 500;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      1500,
      500
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleCropComplete = async () => {
    if (imgRef.current && crop.width && crop.height) {
      try {
        const croppedImageUrl = await getCroppedImg(imgRef.current, crop);
        setImagePreview(croppedImageUrl);
        setFormData(prev => ({ ...prev, featuredImage: croppedImageUrl }));
        setShowCrop(false);
        setOriginalImage(null);
      } catch (error) {
        console.error('Error cropping image:', error);
        alert('Error cropping image. Please try again.');
      }
    }
  };

  const handleCropCancel = () => {
    setShowCrop(false);
    setOriginalImage(null);
    setCrop({
      unit: '%',
      width: 100,
      height: 100,
      x: 0,
      y: 0
    });
  };

  // Inter-text image functions
  const getAspectRatioDimensions = (aspectRatio: string) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    const maxWidth = 800;
    const calculatedHeight = (maxWidth * height) / width;
    return { width: maxWidth, height: Math.round(calculatedHeight) };
  };

  const getInterTextCroppedImg = (image: HTMLImageElement, crop: Crop, aspectRatio: string): Promise<string> => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('No 2d context');
    }

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const dimensions = getAspectRatioDimensions(aspectRatio);

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      dimensions.width,
      dimensions.height
    );

    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        }
      }, 'image/jpeg', 0.9);
    });
  };

  const handleInterTextImageUpload = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setInterTextOriginalImage(result);
        setShowImageModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInterTextCropComplete = async () => {
    if (interTextImgRef.current && interTextCrop.width && interTextCrop.height) {
      try {
        const croppedImageUrl = await getInterTextCroppedImg(interTextImgRef.current, interTextCrop, currentImageData.aspectRatio);
        const dimensions = getAspectRatioDimensions(currentImageData.aspectRatio);
        
        const newImage = {
          id: `img-${Date.now()}`,
          title: currentImageData.title,
          imageUrl: croppedImageUrl,
          aspectRatio: currentImageData.aspectRatio,
          caption: currentImageData.caption,
          width: dimensions.width,
          height: dimensions.height
        };

        setFormData(prev => ({
          ...prev,
          interTextImages: [...prev.interTextImages, newImage]
        }));

        // Reset modal state
        setShowImageModal(false);
        setInterTextOriginalImage(null);
        setCurrentImageData({
          title: '',
          aspectRatio: '16:9',
          caption: ''
        });
        setInterTextCrop({
          unit: '%',
          width: 100,
          height: 100,
          x: 0,
          y: 0
        });
      } catch (error) {
        console.error('Error cropping image:', error);
        alert('Error cropping image. Please try again.');
      }
    }
  };

  const removeInterTextImage = (id: string) => {
    setFormData(prev => ({
      ...prev,
      interTextImages: prev.interTextImages.filter(img => img.id !== id)
    }));
  };

  const getAspectRatioValue = (aspectRatio: string) => {
    const [width, height] = aspectRatio.split(':').map(Number);
    return width / height;
  };

  // Table of contents reordering functions
  const moveTocItemUp = (index: number) => {
    if (index > 0) {
      const newToc = [...formData.tableOfContents];
      [newToc[index], newToc[index - 1]] = [newToc[index - 1], newToc[index]];
      setFormData(prev => ({ ...prev, tableOfContents: newToc }));
    }
  };

  const moveTocItemDown = (index: number) => {
    if (index < formData.tableOfContents.length - 1) {
      const newToc = [...formData.tableOfContents];
      [newToc[index], newToc[index + 1]] = [newToc[index + 1], newToc[index]];
      setFormData(prev => ({ ...prev, tableOfContents: newToc }));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleImageUpload(files[0]);
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, featuredImage: undefined }));
  };

  const handleSaveDraft = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      const articleData = {
        ...formData,
        title,
        excerpt,
        lastModified: new Date().toISOString()
      };
      
      // Save to drafts
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      
      // Check if article already exists in drafts
      const existingIndex = draftsData.findIndex((draft: DraftArticle) => draft.id === articleData.id);
      if (existingIndex !== -1) {
        draftsData[existingIndex] = articleData;
      } else {
        draftsData.push(articleData);
      }
      
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      // Show success popup with option to view drafts
      const draftsUrl = `/admin/drafts`;
      if (confirm('Article saved to drafts successfully! Would you like to view your drafts?')) {
        window.open(draftsUrl, '_blank');
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      alert('Error saving draft. Please try again.');
    }
  };

  const handleTestArticle = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract if not set
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      const articleData = {
        ...formData,
        title,
        excerpt,
        lastModified: new Date().toISOString()
      };
      
      // Save to test articles
      const testArticles = localStorage.getItem('testArticles') || '[]';
      const testData = JSON.parse(testArticles);
      
      // Check if article already exists in test
      const existingIndex = testData.findIndex((test: TestArticle) => test.id === articleData.id);
      if (existingIndex !== -1) {
        testData[existingIndex] = articleData;
      } else {
        testData.push(articleData);
      }
      
      localStorage.setItem('testArticles', JSON.stringify(testData));
      
      // Also save to drafts for backup
      const savedDrafts = localStorage.getItem('articleDrafts') || '[]';
      const draftsData = JSON.parse(savedDrafts);
      
      const existingDraftIndex = draftsData.findIndex((draft: DraftArticle) => draft.id === articleData.id);
      if (existingDraftIndex !== -1) {
        draftsData[existingDraftIndex] = articleData;
      } else {
        draftsData.push(articleData);
      }
      
      localStorage.setItem('articleDrafts', JSON.stringify(draftsData));
      
      // Show success popup with option to view test article
      const testArticleUrl = `/admin/test`;
      if (confirm('Article moved to test successfully! Would you like to view the test article?')) {
        window.open(testArticleUrl, '_blank');
      }
    } catch (error) {
      console.error('Error moving to test:', error);
      alert('Error moving to test. Please try again.');
    }
  };

  const handlePublish = () => {
    try {
      // Generate title from project name if not set
      const title = formData.title || `${formData.projectName} Analysis`;
      
      // Generate excerpt from abstract
      const excerpt = formData.excerpt || formData.abstract[currentLevel]?.substring(0, 150) + '...' || '';
      
      // Convert form data to proper Article format
      const articleData = {
        id: formData.id,
        slug: formData.slug || formData.projectName.toLowerCase().replace(/\s+/g, '-'),
        title,
        ticker: formData.ticker,
        subtitle: excerpt,
        classification: formData.category[0] || 'Analysis',
        location: formData.chains[0] || 'Ethereum',
        status: 'published' as const,
        publishedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        author: 'Admin', // Default author
        readingLevels: ['novice', 'technical', 'analyst'] as ReadingLevel[],
        abstract: [
          formData.abstract.novice || '',
          formData.abstract.technical || '',
          formData.abstract.analyst || ''
        ],
        productArchitecture: {
          sections: [
            formData.architecture.novice || '',
            formData.architecture.technical || '',
            formData.architecture.analyst || ''
          ],
          tags: formData.category
        },
        mechanics: [
          formData.mechanics.novice || '',
          formData.mechanics.technical || '',
          formData.mechanics.analyst || ''
        ],
        problemUsersValue: {
          problem: formData.problemUsersValue.novice || '',
          users: formData.teamMembers,
          approach: formData.problemUsersValue.technical || '',
          differentiators: formData.problemUsersValue.analyst ? [formData.problemUsersValue.analyst] : [],
          assumptions: []
        },
        team: formData.teamMembers.map(name => ({ name, role: 'Team Member' })),
        events: [],
        officialLinks: {
          socials: formData.officialLinks.map(url => ({ platform: 'Website', url })),
          technical: []
        },
        ecosystem: formData.category,
        credentials: formData.sources,
        radarRating: {
          growthPotential: 75,
          investmentOpportunity: 70,
          memberOpinions: 80
        },
        stats: {
          tvl: '0',
          volume: '0',
          users: '0',
          capital: '0',
          opinions: '0'
        },
        tokenomics: [],
        content: {
          novice: {
            sections: [
              {
                id: 'abstract',
                title: 'Abstract',
                content: formData.abstract.novice || '',
                order: 1
              },
              {
                id: 'architecture',
                title: 'Product Architecture',
                content: formData.architecture.novice || '',
                order: 2
              },
              {
                id: 'mechanics',
                title: 'Core Mechanics',
                content: formData.mechanics.novice || '',
                order: 3
              },
              {
                id: 'problem-users-value',
                title: 'Problem, Users & Value',
                content: formData.problemUsersValue.novice || '',
                order: 4
              }
            ]
          },
          technical: {
            sections: [
              {
                id: 'abstract',
                title: 'Abstract',
                content: formData.abstract.technical || '',
                order: 1
              },
              {
                id: 'architecture',
                title: 'Product Architecture',
                content: formData.architecture.technical || '',
                order: 2
              },
              {
                id: 'mechanics',
                title: 'Core Mechanics',
                content: formData.mechanics.technical || '',
                order: 3
              },
              {
                id: 'problem-users-value',
                title: 'Problem, Users & Value',
                content: formData.problemUsersValue.technical || '',
                order: 4
              }
            ]
          },
          analyst: {
            sections: [
              {
                id: 'abstract',
                title: 'Abstract',
                content: formData.abstract.analyst || '',
                order: 1
              },
              {
                id: 'architecture',
                title: 'Product Architecture',
                content: formData.architecture.analyst || '',
                order: 2
              },
              {
                id: 'mechanics',
                title: 'Core Mechanics',
                content: formData.mechanics.analyst || '',
                order: 3
              },
              {
                id: 'problem-users-value',
                title: 'Problem, Users & Value',
                content: formData.problemUsersValue.analyst || '',
                order: 4
              }
            ]
          }
        },
        featuredImage: formData.featuredImage,
        interTextImages: formData.interTextImages,
        tableOfContents: formData.tableOfContents,
        tags: formData.category,
        viewCount: 0,
        likeCount: 0
      };
      
      // Use localStorageDB to save the article
      if (isEditing) {
        // Update existing article
        const updatedArticle = localStorageDB.updateArticle(formData.id, articleData);
        if (!updatedArticle) {
          throw new Error('Failed to update article');
        }
      } else {
        // Create new article
        const newArticle = localStorageDB.createArticle(articleData);
        if (!newArticle) {
          throw new Error('Failed to create article');
        }
      }
      
      // Show success popup with option to view published article
      const publishedArticleUrl = `/article/${articleData.slug}`;
      if (confirm('Article published successfully! Would you like to view the published article?')) {
        window.open(publishedArticleUrl, '_blank');
      }
    } catch (error) {
      console.error('Error publishing article:', error);
      alert('Error publishing article. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-white/5 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/admin" className="text-white/60 hover:text-white transition-colors">
                ← Back to Admin
              </Link>
              <h1 className="text-2xl font-light">
                <span className="bg-gradient-to-r from-[#E4E4E4] to-[rgb(var(--color-horizon-green))] bg-clip-text text-transparent">
                  {isEditing ? 'EDIT ARTICLE' : 'CREATE NEW ARTICLE'}
                </span>
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={isEditing ? handlePublish : handleSaveDraft}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-300"
              >
                {isEditing ? 'UPDATE ARTICLE' : 'SAVE ARTICLE'}
              </button>
              <button
                onClick={handleTestArticle}
                className="px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all duration-300"
              >
                TEST ARTICLE
              </button>
              <button
                onClick={handlePublish}
                className="px-6 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-all duration-300"
              >
                PUBLISH ARTICLE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reading Level Selector */}
      <div className="bg-white/3 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <span className="text-white/60">Reading Level:</span>
                            {(['novice', 'technical', 'analyst'] as ReadingLevel[]).map((level) => (
              <button
                key={level}
                onClick={() => setCurrentLevel(level)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  currentLevel === level
                    ? 'bg-[rgb(var(--color-horizon-green))] text-black'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Article Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="Enter article title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">URL Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="e.g., glow-analysis, ethereum-pos, uniswap-v4"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Project Name</label>
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectName: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-transparent"
                  placeholder="Enter project name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Ticker</label>
                <input
                  type="text"
                  value={formData.ticker}
                  onChange={(e) => setFormData(prev => ({ ...prev, ticker: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  placeholder="e.g., BTC, ETH"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                >
                  <option value="">Select status</option>
                  <option value="Mainnet">Mainnet</option>
                  <option value="Testnet">Testnet</option>
                  <option value="Development">Development</option>
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="premium"
                  checked={formData.premium}
                  onChange={(e) => setFormData(prev => ({ ...prev, premium: e.target.checked }))}
                  className="w-5 h-5 text-[rgb(var(--color-horizon-green))] bg-white/10 border-white/20 rounded focus:ring-[rgb(var(--color-horizon-green))] focus:ring-2"
                />
                <label htmlFor="premium" className="text-white/80">Premium Article</label>
              </div>
            </div>
            
            {/* Excerpt */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Article Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                rows={3}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                placeholder="Enter a brief excerpt/summary of the article (optional - will auto-generate from abstract if left empty)"
              />
            </div>

            {/* Categories */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Categories</label>
              {formData.category.map((cat, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={cat}
                    onChange={(e) => updateArrayItem('category', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter category"
                  />
                  {formData.category.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('category', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('category')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Category</span>
              </button>
            </div>

            {/* Chains */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Chains</label>
              {formData.chains.map((chain, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={chain}
                    onChange={(e) => updateArrayItem('chains', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter chain name"
                  />
                  {formData.chains.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('chains', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('chains')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Chain</span>
              </button>
            </div>
          </div>

          {/* Image Banner Upload */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Article Banner Image</h2>
            <div className="space-y-4">
              {showCrop && originalImage ? (
                <div className="space-y-4">
                  <div className="bg-black/50 rounded-lg p-4">
                    <p className="text-white/80 mb-4 text-center">
                      Crop your image to 1500x500 pixels. Drag the corners to adjust the crop area.
                    </p>
                    <div className="flex justify-center">
                      <ReactCrop
                        crop={crop}
                        onChange={(c) => setCrop(c)}
                        aspect={3}
                        minWidth={100}
                        minHeight={50}
                      >
                        <Image
                          ref={imgRef}
                          src={originalImage}
                          alt="Crop preview"
                          width={800}
                          height={600}
                          className="max-h-96 max-w-full"
                        />
                      </ReactCrop>
                    </div>
                    <div className="flex justify-center space-x-4 mt-4">
                      <button
                        onClick={handleCropComplete}
                        className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors"
                      >
                        Apply Crop
                      </button>
                      <button
                        onClick={handleCropCancel}
                        className="px-4 py-2 bg-white/10 border border-white/20 text-white rounded-lg font-medium hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              ) : imagePreview ? (
                <div className="relative">
                  <Image 
                    src={imagePreview} 
                    alt="Banner preview" 
                    fill
                    className="object-cover rounded-lg border border-white/20"
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    isDragOver 
                      ? 'border-[rgb(var(--color-horizon-green))] bg-[rgb(var(--color-horizon-green))]/10' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <div className="space-y-4">
                    <svg 
                      className="mx-auto h-12 w-12 text-white/40" 
                      stroke="currentColor" 
                      fill="none" 
                      viewBox="0 0 48 48"
                    >
                      <path 
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" 
                        strokeWidth={2} 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                      />
                    </svg>
                    <div>
                      <p className="text-white/80 font-medium">Drop your banner image here</p>
                      <p className="text-white/60 text-sm mt-1">or click to browse</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileInput}
                      className="hidden"
                      id="image-upload"
                    />
                    <label
                      htmlFor="image-upload"
                      className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                      Choose Image
                    </label>
                  </div>
                </div>
              )}
              <p className="text-white/60 text-sm">
                Upload a banner image for your article. Recommended size: 1500x500 pixels. 
                Supported formats: JPG, PNG, GIF, WebP.
              </p>
            </div>
          </div>

          {/* Inter-Text Images */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Inter-Text Images</h2>
            
            {/* Instructions */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4 mb-6">
              <h3 className="text-lg font-medium mb-3 text-white/90">How to Use Inter-Text Images</h3>
              <div className="space-y-3 text-sm text-white/70">
                <div>
                  <strong>1. Upload Images:</strong> Add images below with titles like &quot;TokenomicsChart&quot; or &quot;ArchitectureDiagram&quot;
                </div>
                <div>
                  <strong>2. Reference in Text:</strong> In any content section, type <code className="bg-white/20 px-1 rounded">**[ImageTitle]**</code> where you want the image to appear
                </div>
                <div>
                  <strong>3. Formatting:</strong> Images will be automatically centered with 2rem (32px) spacing above and below
                </div>
                <div>
                  <strong>4. Example:</strong> &quot;The tokenomics structure shows **[TokenomicsChart]** that 60% goes to liquidity...&quot;
                </div>
                <div>
                  <strong>5. Supported Formats:</strong> JPG, PNG, GIF, WebP. Images will be automatically cropped to your selected aspect ratio.
                </div>
              </div>
            </div>

            {/* Image List */}
            <div className="space-y-4">
              {formData.interTextImages.map((image) => (
                <div key={image.id} className="flex items-center space-x-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                  <Image 
                    src={image.imageUrl} 
                    alt={image.title}
                    width={64}
                    height={64}
                    className="object-cover rounded border border-white/20"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-white/90">{image.title}</h4>
                    <p className="text-sm text-white/60">
                      {image.width}×{image.height}px • {image.aspectRatio} ratio
                      {image.caption && ` • Caption: ${image.caption}`}
                    </p>
                    <p className="text-xs text-white/50 mt-1">
                      Reference: <code className="bg-white/20 px-1 rounded">**[{image.title}]**</code>
                    </p>
                  </div>
                  <button
                    onClick={() => removeInterTextImage(image.id)}
                    className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {formData.interTextImages.length === 0 && (
                <div className="text-center py-8 text-white/50">
                  <svg className="mx-auto h-12 w-12 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No inter-text images added yet</p>
                  <p className="text-sm">Click &quot;Add Image&quot; to get started</p>
                </div>
              )}
            </div>

            {/* Add Image Button */}
            <div className="mt-6">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    handleInterTextImageUpload(files[0]);
                  }
                }}
                className="hidden"
                id="inter-text-image-upload"
              />
              <label
                htmlFor="inter-text-image-upload"
                className="inline-flex items-center px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors cursor-pointer"
              >
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Image
              </label>
            </div>
          </div>

          {/* Content Sections */}
          {(['tldr', 'abstract', 'architecture', 'mechanics', 'problemUsersValue', 'tokenomics', 'authorSources', 'disclaimer', 'community'] as const).map((section) => (
            <div key={section} className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium capitalize">
                  {section === 'tldr' ? 'TLDR' : 
                   section === 'problemUsersValue' ? 'Problem, Users & Value' :
                   section === 'authorSources' ? 'Author Sources' :
                   section.charAt(0).toUpperCase() + section.slice(1)}
                </h3>
                <div className="flex items-center space-x-2">
                  {/* Visibility toggle for current level */}
                  <button
                    onClick={() => toggleSectionVisibility(section, currentLevel)}
                    className={`p-2 rounded-lg transition-colors ${
                      sectionStates[section][currentLevel]
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white/50'
                    }`}
                    title={sectionStates[section][currentLevel] ? 'Hide section' : 'Show section'}
                  >
                    {sectionStates[section][currentLevel] ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                  </button>
                  
                  {/* Synchronization status and controls */}
                  <div className="flex items-center space-x-2">
                    {synchronizedSections[section] ? (
                      <>
                        <span className="px-3 py-2 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-medium">
                          (Currently Synchronized)
                        </span>
                        <button
                          onClick={() => untetherSynchronization(section)}
                          className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                        >
                          Untether Synchronization
                        </button>
                      </>
                    ) : (
                      <>
                        <span className="px-3 py-2 bg-red-600/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
                          (Currently Unsynchronized)
                        </span>
                        <button
                          onClick={() => syncFromAdvanced(section)}
                          className="px-3 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Sync From Analyst
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {sectionStates[section][currentLevel] && (
                <div className="space-y-4">
                  {synchronizedSections[section] ? (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Content (Synchronized across all levels)
                      </label>
                      <textarea
                        value={formData[section].analyst}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData(prev => ({
                            ...prev,
                            [section]: { novice: value, technical: value, analyst: value }
                          }));
                        }}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder={`Enter ${section} content...`}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Content for {currentLevel.charAt(0).toUpperCase() + currentLevel.slice(1)} Level
                      </label>
                      <textarea
                        value={formData[section][currentLevel]}
                        onChange={(e) => {
                          setFormData(prev => ({
                            ...prev,
                            [section]: { ...prev[section], [currentLevel]: e.target.value }
                          }));
                        }}
                        rows={4}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder={`Enter ${section} content for ${currentLevel} level...`}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {/* Flexible Arrays */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Team & Links</h2>
            
            {/* Team Members */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Team Members</label>
              {formData.teamMembers.map((member, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={member}
                    onChange={(e) => updateArrayItem('teamMembers', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter team member name and role"
                  />
                  {formData.teamMembers.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('teamMembers', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('teamMembers')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Team Member</span>
              </button>
            </div>

            {/* Official Links */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white/80 mb-2">Official Links</label>
              {formData.officialLinks.map((link, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateArrayItem('officialLinks', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter official link"
                  />
                  {formData.officialLinks.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('officialLinks', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('officialLinks')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Official Link</span>
              </button>
            </div>

            {/* Sources */}
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Sources</label>
              {formData.sources.map((source, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <input
                    type="text"
                    value={source}
                    onChange={(e) => updateArrayItem('sources', index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Enter source reference"
                  />
                  {formData.sources.length > 1 && (
                    <button
                      onClick={() => removeArrayItem('sources', index)}
                      className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => addArrayItem('sources')}
                className="mt-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Source</span>
              </button>
            </div>
          </div>

          {/* Article Sidebar Data */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Article Sidebar Data</h2>
            
            {/* Radar Rating */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Radar Rating</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Growth Potential</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.radarRating.growthPotential}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      radarRating: { ...prev.radarRating, growthPotential: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Investment Opportunity</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.radarRating.investmentOpportunity}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      radarRating: { ...prev.radarRating, investmentOpportunity: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Member Opinions</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.radarRating.memberOpinions}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      radarRating: { ...prev.radarRating, memberOpinions: parseInt(e.target.value) || 0 }
                    }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>

            {/* Notable Stats */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Notable Stats</h3>
              <div className="space-y-4">
                {formData.notableStats.map((stat, index) => (
                  <div key={stat.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={stat.title}
                        onChange={(e) => {
                          const newStats = [...formData.notableStats];
                          newStats[index] = { ...newStats[index], title: e.target.value };
                          setFormData(prev => ({ ...prev, notableStats: newStats }));
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Stat title (e.g., TVL, 24h Volume)"
                      />
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const newStats = [...formData.notableStats];
                          newStats[index] = { ...newStats[index], value: e.target.value };
                          setFormData(prev => ({ ...prev, notableStats: newStats }));
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Stat value (e.g., $1.2B, 50K)"
                      />
                    </div>
                    {formData.notableStats.length > 1 && (
                      <button
                        onClick={() => {
                          const newStats = formData.notableStats.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, notableStats: newStats }));
                        }}
                        className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newId = `stat-${Date.now()}`;
                    setFormData(prev => ({
                      ...prev,
                      notableStats: [...prev.notableStats, { id: newId, title: '', value: '' }]
                    }));
                  }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Stat</span>
                </button>
              </div>
            </div>

            {/* Tokenomics Data */}
            <div>
              <h3 className="text-lg font-medium mb-4">Tokenomics</h3>
              <div className="space-y-4">
                {formData.tokenomicsData.map((item, index) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={item.category}
                        onChange={(e) => {
                          const newTokenomics = [...formData.tokenomicsData];
                          newTokenomics[index] = { ...newTokenomics[index], category: e.target.value };
                          setFormData(prev => ({ ...prev, tokenomicsData: newTokenomics }));
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="Category (e.g., Liquidity, Team, Community)"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={item.percentage}
                        onChange={(e) => {
                          const newTokenomics = [...formData.tokenomicsData];
                          newTokenomics[index] = { ...newTokenomics[index], percentage: parseInt(e.target.value) || 0 };
                          setFormData(prev => ({ ...prev, tokenomicsData: newTokenomics }));
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                        placeholder="%"
                      />
                    </div>
                    <div className="w-32">
                      <select
                        value={item.status}
                        onChange={(e) => {
                          const newTokenomics = [...formData.tokenomicsData];
                          newTokenomics[index] = { ...newTokenomics[index], status: e.target.value as 'active' | 'locked' | 'vesting' };
                          setFormData(prev => ({ ...prev, tokenomicsData: newTokenomics }));
                        }}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                      >
                        <option value="active">Active</option>
                        <option value="locked">Locked</option>
                        <option value="vesting">Vesting</option>
                      </select>
                    </div>
                    {formData.tokenomicsData.length > 1 && (
                      <button
                        onClick={() => {
                          const newTokenomics = formData.tokenomicsData.filter((_, i) => i !== index);
                          setFormData(prev => ({ ...prev, tokenomicsData: newTokenomics }));
                        }}
                        className="p-3 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => {
                    const newId = `tokenomics-${Date.now()}`;
                    setFormData(prev => ({
                      ...prev,
                      tokenomicsData: [...prev.tokenomicsData, { id: newId, category: '', percentage: 0, status: 'active' as const }]
                    }));
                  }}
                  className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors flex items-center space-x-2"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add Tokenomics Item</span>
                </button>
              </div>
            </div>
          </div>

          {/* Custom Sections */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Custom Sections</h2>
              <button
                onClick={addCustomSection}
                className="px-4 py-2 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Add Custom Section</span>
              </button>
            </div>
            
            {formData.customSections.map((section) => (
              <div key={section.id} className="border border-white/20 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => updateCustomSection(section.id, 'title', e.target.value)}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent mr-4"
                    placeholder="Section title"
                  />
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateCustomSection(section.id, 'visible', !section.visible)}
                      className={`p-2 rounded-lg transition-colors ${
                        section.visible 
                          ? 'bg-white/20 text-white' 
                          : 'bg-white/10 text-white/50'
                      }`}
                      title={`${section.visible ? 'Hide' : 'Show'} section for all levels`}
                    >
                      {section.visible ? <EyeIcon className="w-5 h-5" /> : <EyeSlashIcon className="w-5 h-5" />}
                    </button>
                    <button
                      onClick={() => removeCustomSection(section.id)}
                      className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 hover:bg-red-500/30 transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                
                {section.visible && (
                  <textarea
                    value={section.content[currentLevel]}
                    onChange={(e) => {
                      const newContent = { ...section.content, [currentLevel]: e.target.value };
                      updateCustomSection(section.id, 'content', newContent);
                    }}
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder={`Enter content for ${currentLevel} level...`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Table of Contents */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6">
            <h2 className="text-xl font-medium mb-6">Table of Contents</h2>
            <div className="space-y-2">
              {formData.tableOfContents.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const newToc = [...formData.tableOfContents];
                      newToc[index] = e.target.value;
                      setFormData(prev => ({ ...prev, tableOfContents: newToc }));
                    }}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Table of contents item"
                  />
                  <div className="flex flex-col h-full">
                    <button 
                      onClick={() => moveTocItemUp(index)}
                      disabled={index === 0}
                      className="flex-1 px-3 bg-white/10 border border-white/20 rounded-t-lg text-white/60 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Move up"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="18,15 12,9 6,15"></polyline>
                      </svg>
                    </button>
                    <button 
                      onClick={() => moveTocItemDown(index)}
                      disabled={index === formData.tableOfContents.length - 1}
                      className="flex-1 px-3 bg-white/10 border border-white/20 rounded-b-lg text-white/60 hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                      title="Move down"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6,9 12,15 18,9"></polyline>
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Word Count Summary */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mt-8">
        <h2 className="text-xl font-medium mb-6">Content Summary & Word Counts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left py-3 px-4 font-medium text-white/80">Section</th>
                <th className="text-center py-3 px-4 font-medium text-white/80">Novice</th>
                <th className="text-center py-3 px-4 font-medium text-white/80">Technical</th>
                <th className="text-center py-3 px-4 font-medium text-white/80">Analyst</th>
              </tr>
            </thead>
            <tbody>
              {formData.tableOfContents.map((sectionName, index) => {
                // Map table of contents names to actual section keys
                const sectionKey = sectionName.toLowerCase().replace(/[^a-z]/g, '') as keyof ArticleFormData;
                const sectionData = formData[sectionKey] as Record<ReadingLevel, string> | undefined;
                
                // Get word counts for each reading level
                const getWordCount = (level: ReadingLevel) => {
                  if (!sectionData || !sectionStates[sectionKey]?.[level]) {
                    return { count: 0, hidden: true };
                  }
                  const text = sectionData[level] || '';
                  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                  return { count: words.length, hidden: false };
                };

                const noviceCount = getWordCount('novice');
                const technicalCount = getWordCount('technical');
                const analystCount = getWordCount('analyst');

                return (
                  <tr key={index} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/90 font-medium">
                      {sectionName}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {noviceCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{noviceCount.count} words</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {technicalCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{technicalCount.count} words</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {analystCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{analystCount.count} words</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {/* Custom Sections */}
              {formData.customSections.map((section) => {
                const getCustomWordCount = (level: ReadingLevel) => {
                  if (!section.visible) {
                    return { count: 0, hidden: true };
                  }
                  const text = section.content[level] || '';
                  const words = text.trim().split(/\s+/).filter(word => word.length > 0);
                  return { count: words.length, hidden: false };
                };

                const noviceCount = getCustomWordCount('novice');
                const technicalCount = getCustomWordCount('technical');
                const analystCount = getCustomWordCount('analyst');

                return (
                  <tr key={`custom-${section.id}`} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-white/90 font-medium">
                      {section.title || 'Untitled Custom Section'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {noviceCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{noviceCount.count} words</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {technicalCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{technicalCount.count} words</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {analystCount.hidden ? (
                        <span className="text-white/50 opacity-50">[Hidden]</span>
                      ) : (
                        <span className="text-white/80">{analystCount.count} words</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inter-Text Image Upload Modal */}
      {showImageModal && interTextOriginalImage && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium">Add Inter-Text Image</h2>
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setInterTextOriginalImage(null);
                  setCurrentImageData({
                    title: '',
                    aspectRatio: '16:9',
                    caption: ''
                  });
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Image Configuration */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Image Title</label>
                  <input
                    type="text"
                    value={currentImageData.title}
                    onChange={(e) => setCurrentImageData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="e.g., TokenomicsChart, ArchitectureDiagram"
                  />
                  <p className="text-xs text-white/60 mt-1">
                    This will be used as the reference: <code className="bg-white/20 px-1 rounded">**[{currentImageData.title || 'ImageTitle'}]**</code>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Aspect Ratio</label>
                  <select
                    value={currentImageData.aspectRatio}
                    onChange={(e) => setCurrentImageData(prev => ({ ...prev, aspectRatio: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                  >
                    <option value="16:9">16:9 (Wide)</option>
                    <option value="4:3">4:3 (Standard)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="3:2">3:2 (Photo)</option>
                    <option value="2:1">2:1 (Ultra Wide)</option>
                  </select>
                  <p className="text-xs text-white/60 mt-1">
                    Final size: {getAspectRatioDimensions(currentImageData.aspectRatio).width}×{getAspectRatioDimensions(currentImageData.aspectRatio).height}px
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Caption (Optional)</label>
                  <input
                    type="text"
                    value={currentImageData.caption}
                    onChange={(e) => setCurrentImageData(prev => ({ ...prev, caption: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[rgb(var(--color-horizon-green))] focus:border-transparent"
                    placeholder="Brief description of the image"
                  />
                </div>

                <div className="pt-4">
                  <button
                    onClick={handleInterTextCropComplete}
                    disabled={!currentImageData.title}
                    className="w-full px-4 py-3 bg-[rgb(var(--color-horizon-green))] text-black rounded-lg font-medium hover:bg-[rgb(var(--color-horizon-green))]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Image
                  </button>
                </div>
              </div>

              {/* Image Crop Preview */}
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Crop Image</label>
                <div className="bg-black/50 rounded-lg p-4">
                  <ReactCrop
                    crop={interTextCrop}
                    onChange={(c) => setInterTextCrop(c)}
                    aspect={getAspectRatioValue(currentImageData.aspectRatio)}
                    minWidth={50}
                    minHeight={50}
                  >
                    <Image
                      ref={interTextImgRef}
                      src={interTextOriginalImage}
                      alt="Crop preview"
                      width={800}
                      height={600}
                      className="max-h-80 max-w-full"
                    />
                  </ReactCrop>
                  <p className="text-xs text-white/60 mt-2 text-center">
                    Drag the corners to adjust the crop area. Image will be automatically resized to {getAspectRatioDimensions(currentImageData.aspectRatio).width}×{getAspectRatioDimensions(currentImageData.aspectRatio).height}px
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CreateArticlePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateArticlePageContent />
    </Suspense>
  );
}
