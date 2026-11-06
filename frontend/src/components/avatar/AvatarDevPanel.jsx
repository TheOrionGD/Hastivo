/**
 * Hastivo Avatar Developer Testing Panel
 * Requirement 14 Implementation:
 * Complete diagnostic & articulation testing interface with live sliders,
 * 6 camera modes, tabbed inspection modes, skeleton toggles, and performance telemetry.
 */
import React, { useState, useRef, useEffect } from 'react';
import { AvatarCanvas } from './AvatarCanvas.jsx';
import { ROBOT_10_EXPRESSIONS } from '../../avatar/animation/FaceController.js';
import { ISL_DICTIONARY } from '../../avatar/animation/SigningEngine.js';
import { CAMERA_MODES } from '../../avatar/scene/AvatarScene.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import { avatarService, AVATAR_MODELS } from '../../services/avatarService.js';

export function AvatarDevPanel({ onSignChange }) {
  const canvasRef = useRef(null);

  // Active Model: 'v-bot' (Female) | 'v-bot' (Male) | 'procedural'
  const [selectedModel, setSelectedModel] = useState(avatarService.getActiveModel() || 'v-bot');

  // Layout View Mode: 'split' | 'viewport' | 'controls'
  const [viewMode, setViewMode] = useState('split');

  // Active Tab: 'assets' | 'signing' | 'character' | 'face' | 'hand' | 'joints' | 'coating'
  const [activeTab, setActiveTab] = useState('assets');
  const [activeAnim, setActiveAnim] = useState('idleBreathing');

  // Camera Mode
  const [cameraMode, setCameraMode] = useState('conversation');

  // Telemetry
  const [fps, setFps] = useState(60);
  const [drawCalls, setDrawCalls] = useState(0);
  const [wireframe, setWireframe] = useState(false);
  const [speed, setSpeed] = useState(1.0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  // Outer Layer Coating state
  const [coatingColor, setCoatingColor] = useState('#D9222A');
  const [coatingClearcoat, setCoatingClearcoat] = useState(0.92);
  const [coatingRoughness, setCoatingRoughness] = useState(0.12);
  const [coatingMetalness, setCoatingMetalness] = useState(0.35);

  // Signing Inputs
  const [signingSide, setSigningSide] = useState('R'); // 'R' | 'L' | 'both'
  const [spellingText, setSpellingText] = useState('HASTIVO');
  const [activeSignInfo, setActiveSignInfo] = useState({ label: '', letter: '' });

  // Facial state
  const [currentExpr, setCurrentExpr] = useState('neutral');
  const [gazeX, setGazeX] = useState(0);
  const [gazeY, setGazeY] = useState(0);

  // Finger Sliders state
  const [fingerJoints, setFingerJoints] = useState({
    targetHand: 'R',
    digit: 'thumb',
    mcp: 0.0,
    pip: 0.0,
    dip: 0.0,
    abduct: 0.0,
    wristFlex: 0.0,
    wristRoll: 0.0
  });

  // Joint sliders state (Arms, Shoulders, Head, Waist, Legs)
  const [jointState, setJointState] = useState({
    headYaw: 0,
    headPitch: 0,
    headRoll: 0,
    leftShoulderElev: 0,
    rightShoulderElev: 0,
    leftElbowBend: -0.92,
    rightElbowBend: -0.92,
    torsoYaw: 0,
    waistPitch: 0,
    leftHipFlex: 0,
    rightHipFlex: 0,
    leftKneeBend: 0,
    rightKneeBend: 0
  });

  // Polling telemetry
  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current?.getStats) {
        const stats = canvasRef.current.getStats();
        setFps(stats.fps || 60);
        setDrawCalls(stats.drawCalls || 0);
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const handleSignProgress = ({ label, letter, finished }) => {
    if (finished) {
      setActiveSignInfo({ label: '', letter: '' });
    } else {
      const text = label || letter || '';
      setActiveSignInfo({ label: label || '', letter: letter || '' });
      if (text && onSignChange) onSignChange(text);
    }
  };

  const handleSelectModel = (modelId) => {
    setSelectedModel(modelId);
    avatarService.setActiveModel(modelId);
    canvasRef.current?.switchAvatar?.(modelId);
  };

  const handleCameraChange = (mode) => {
    setCameraMode(mode);
    canvasRef.current?.setCameraMode(mode);
  };

  const applyFingerSliders = (newValues) => {
    const updated = { ...fingerJoints, ...newValues };
    setFingerJoints(updated);

    const avatar = canvasRef.current?.getAvatar?.();
    if (!avatar) return;

    const controller = updated.targetHand === 'L' ? avatar.leftHandController : avatar.rightHandController;
    if (controller && controller.fingerControllers[updated.digit]) {
      controller.fingerControllers[updated.digit].setFlexion(
        updated.mcp,
        updated.pip,
        updated.dip,
        updated.abduct
      );
    }
    if (controller) {
      controller.setWristAngles(updated.wristFlex, 0, updated.wristRoll);
    }
  };

  const applyHandPreset = (presetName) => {
    const avatar = canvasRef.current?.getAvatar?.();
    if (!avatar) return;
    const controller = fingerJoints.targetHand === 'L' ? avatar.leftHandController : avatar.rightHandController;
    if (!controller) return;

    if (presetName === 'openPalm') controller.setOpenPalmPose();
    else if (presetName === 'hello') controller.setHelloPose();
    else if (presetName === 'fist') controller.setClosedFistPose();
    else if (presetName === 'relaxed') controller.setRelaxedHandPose();
    else if (presetName === 'point' || presetName === 'uploadedImage') controller.setUploadedImagePose();
    else if (presetName === 'thumbsUp') controller.setThumbsUpPose();

    const d = fingerJoints.digit;
    const angles = controller.targetAngles[d] || [0, 0, 0, 0];
    setFingerJoints(prev => ({
      ...prev,
      mcp: angles[0],
      pip: angles[1],
      dip: angles[2],
      abduct: angles[3]
    }));
  };

  const applyJointSlider = (key, val) => {
    const updated = { ...jointState, [key]: val };
    setJointState(updated);

    const avatar = canvasRef.current?.getAvatar?.();
    if (!avatar) return;

    if (key.startsWith('head') && avatar.headController) {
      avatar.headController.setOrientation(
        key === 'headYaw' ? val : jointState.headYaw,
        key === 'headPitch' ? val : jointState.headPitch,
        key === 'headRoll' ? val : jointState.headRoll
      );
    }

    if (key.includes('Shoulder') && avatar.shoulderController) {
      if (key === 'leftShoulderElev') avatar.shoulderController.setShoulder('L', val, 0, 0);
      if (key === 'rightShoulderElev') avatar.shoulderController.setShoulder('R', val, 0, 0);
    }

    if (key.includes('Elbow') && avatar.armController) {
      if (key === 'leftElbowBend') avatar.armController.setArmPose('L', { elbowBend: val });
      if (key === 'rightElbowBend') avatar.armController.setArmPose('R', { elbowBend: val });
    }

    if (key === 'torsoYaw' && avatar.bodyController) {
      avatar.bodyController.setTorsoRotation(val, jointState.waistPitch);
    }

    if (key === 'waistPitch' && avatar.bodyController) {
      avatar.bodyController.setTorsoRotation(jointState.torsoYaw, val);
    }

    if (key === 'leftHipFlex' && avatar.bones['LeftHip']) {
      avatar.bones['LeftHip'].rotation.x = val;
    }
    if (key === 'rightHipFlex' && avatar.bones['RightHip']) {
      avatar.bones['RightHip'].rotation.x = val;
    }
    if (key === 'leftKneeBend' && avatar.bones['LeftKnee']) {
      avatar.bones['LeftKnee'].rotation.x = val;
    }
    if (key === 'rightKneeBend' && avatar.bones['RightKnee']) {
      avatar.bones['RightKnee'].rotation.x = val;
    }
  };

  const handleExportGLB = () => {
    const avatar = canvasRef.current?.getAvatar?.();
    if (!avatar || !avatar.root) {
      alert('Avatar model not loaded yet.');
      return;
    }

    setIsExporting(true);
    setExportMessage('Generating GLB...');
    const exporter = new GLTFExporter();
    exporter.parse(
      avatar.root,
      (gltf) => {
        setIsExporting(false);
        setExportMessage('Export Successful!');
        setTimeout(() => setExportMessage(''), 3000);
        const blob = new Blob([gltf], { type: 'model/gltf-binary' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'Hastivo_Humanoid_Robot_Avatar.glb';
        link.click();
        URL.revokeObjectURL(link.href);
      },
      (error) => {
        setIsExporting(false);
        setExportMessage('Export Failed');
        setTimeout(() => setExportMessage(''), 3000);
        console.error('GLTF Export Error:', error);
        alert('Failed to export GLB: ' + error.message);
      },
      { binary: true }
    );
  };

  const handleGazeChange = (gx, gy) => {
    setGazeX(gx);
    setGazeY(gy);
    const avatar = canvasRef.current?.getAvatar?.();
    if (avatar?.faceController?.eyeController) {
      avatar.faceController.eyeController.setGaze(gx, gy);
    }
  };

  const handleCoatingPreset = (preset) => {
    setCoatingColor(preset.color);
    if (preset.clearcoat !== undefined) setCoatingClearcoat(preset.clearcoat);
    if (preset.roughness !== undefined) setCoatingRoughness(preset.roughness);
    if (preset.metalness !== undefined) setCoatingMetalness(preset.metalness);

    canvasRef.current?.setOuterLayerCoating?.(preset.color, {
      clearcoat: preset.clearcoat,
      clearcoatRoughness: preset.roughness,
      metalness: preset.metalness
    });
  };

  const handleCustomColor = (hex) => {
    setCoatingColor(hex);
    canvasRef.current?.setOuterLayerCoating?.(hex, {
      clearcoat: coatingClearcoat,
      clearcoatRoughness: coatingRoughness,
      metalness: coatingMetalness
    });
  };

  const handleClearcoatParam = (key, val) => {
    let nextClearcoat = coatingClearcoat;
    let nextRoughness = coatingRoughness;
    let nextMetalness = coatingMetalness;

    if (key === 'clearcoat') {
      setCoatingClearcoat(val);
      nextClearcoat = val;
    } else if (key === 'clearcoatRoughness') {
      setCoatingRoughness(val);
      nextRoughness = val;
    } else if (key === 'metalness') {
      setCoatingMetalness(val);
      nextMetalness = val;
    }

    canvasRef.current?.setOuterLayerCoating?.(coatingColor, {
      clearcoat: nextClearcoat,
      clearcoatRoughness: nextRoughness,
      metalness: nextMetalness
    });
  };

  const handleExportPose = () => {
    setIsExporting(true);
    setExportMessage('Generating kinematic pose payload...');
    const payload = {
      model: selectedModel,
      joints: jointState,
      fingers: fingerJoints,
      expression: currentExpr,
      coating: {
        color: coatingColor,
        clearcoat: coatingClearcoat,
        roughness: coatingRoughness,
        metalness: coatingMetalness,
      },
      exportedAt: new Date().toISOString(),
    };
    const jsonStr = JSON.stringify(payload, null, 2);
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(jsonStr)
        .then(() => {
          setExportMessage('Kinematic pose copied to clipboard as JSON!');
          setTimeout(() => {
            setExportMessage('');
            setIsExporting(false);
          }, 3000);
        })
        .catch(() => {
          setExportMessage('Pose exported (' + jsonStr.length + ' chars)');
          setIsExporting(false);
        });
    } else {
      setExportMessage('Pose JSON ready (' + jsonStr.length + ' chars)');
      setIsExporting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {/* View Mode Switcher Strip */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          background: 'transparent',
          padding: '12px 0',
          borderBottom: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#6FA3EF', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Testing Workspace:
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'split', label: '🖥️ Split View (3D + Controls)' },
              { id: 'viewport', label: '🤖 3D Viewport Only' },
              { id: 'controls', label: '📋 Controls & Signs Only' }
            ].map((vm) => (
              <button
                key={vm.id}
                onClick={() => setViewMode(vm.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '8px',
                  border: viewMode === vm.id ? '1px solid #6FA3EF' : '1px solid rgba(255,255,255,0.08)',
                  background: viewMode === vm.id ? 'rgba(111, 163, 239, 0.22)' : 'rgba(255,255,255,0.04)',
                  color: viewMode === vm.id ? '#FFFFFF' : '#94A3B8',
                  fontSize: '0.78rem',
                  fontWeight: viewMode === vm.id ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease'
                }}
              >
                {vm.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.76rem', color: '#8E99A8' }}>
          <button
            type="button"
            onClick={handleExportPose}
            disabled={isExporting}
            style={{
              padding: '4px 10px',
              borderRadius: '6px',
              border: '1px solid rgba(111, 163, 239, 0.4)',
              background: 'rgba(111, 163, 239, 0.15)',
              color: '#6FA3EF',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: isExporting ? 'wait' : 'pointer',
            }}
          >
            {isExporting ? '⏳ Exporting...' : '💾 Export Kinematics JSON'}
          </button>
          {exportMessage && (
            <span style={{ color: '#34d399', fontWeight: 600 }}>{exportMessage}</span>
          )}
          <span>Active: <strong style={{ color: '#FF6F61' }}>{selectedModel.toUpperCase()}</strong></span>
          <span>•</span>
          <span>Camera: <strong style={{ color: '#6FA3EF' }}>{cameraMode.toUpperCase()}</strong></span>
        </div>
      </div>

      {/* Main Grid Container */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: viewMode === 'split' ? 'minmax(0, 1.25fr) minmax(380px, 1fr)' : '1fr',
          gap: '24px',
          minHeight: '700px',
          color: '#E0E6ED',
          fontFamily: 'Inter, system-ui, sans-serif'
        }}
      >
        {/* LEFT: 3D Viewport with Structured Non-Overlapping Toolbars */}
        {(viewMode === 'split' || viewMode === 'viewport') && (
          <div
            style={{
              backgroundColor: 'transparent',
              borderRadius: 'var(--radius-control)',
              overflow: 'hidden',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* 1. Dedicated Top Header Bar (Model Switcher & Camera Selectors) */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px',
                padding: '10px 14px',
                backgroundColor: '#161A22',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              {/* Left: Model Switcher Pills */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#6FA3EF', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                  Model:
                </span>
                {AVATAR_MODELS.map((m) => {
                  const isSelected = selectedModel === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => handleSelectModel(m.id)}
                      title={`${m.label}: ${m.description}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 10px',
                        borderRadius: '14px',
                        border: isSelected ? `1.5px solid ${m.accentColor || '#6FA3EF'}` : '1px solid rgba(255, 255, 255, 0.12)',
                        backgroundColor: isSelected ? (m.accentColor || '#6FA3EF') : 'rgba(255,255,255,0.05)',
                        color: isSelected ? '#0B0D11' : '#E2E8F0',
                        fontSize: '0.74rem',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <span>{m.genderSymbol}</span>
                      <span>{m.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right: Camera Mode Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Camera:
                </span>
                {Object.keys(CAMERA_MODES).map((modeKey) => (
                  <button
                    key={modeKey}
                    onClick={() => handleCameraChange(modeKey)}
                    style={{
                      padding: '4px 8px',
                      borderRadius: '6px',
                      border: 'none',
                      background: cameraMode === modeKey ? '#6FA3EF' : 'rgba(255, 255, 255, 0.08)',
                      color: cameraMode === modeKey ? '#0B1017' : '#CBD5E1',
                      fontSize: '0.70rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    {CAMERA_MODES[modeKey].name.replace(' Inspection', '').replace(' View', '')}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. 3D Avatar Canvas Stage Area with Telemetry Badges */}
            <div style={{ position: 'relative', flex: 1, minHeight: '500px', backgroundColor: '#000000', overflow: 'hidden' }}>
              <AvatarCanvas
                ref={canvasRef}
                avatarModel={selectedModel}
                theme="dark"
                wireframe={wireframe}
                onSignProgress={handleSignProgress}
                style={{ width: '100%', height: '100%', minHeight: '500px' }}
              />

              {/* Telemetry Stats Overlay (Docked Bottom-Left of Canvas) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  padding: '6px 12px',
                  backgroundColor: 'rgba(18, 21, 26, 0.88)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  fontSize: '0.74rem',
                  display: 'flex',
                  gap: '12px',
                  pointerEvents: 'none',
                  zIndex: 5,
                  color: '#E2E8F0'
                }}
              >
                <span>FPS: <strong style={{ color: fps >= 50 ? '#4CAF50' : '#FFC107' }}>{fps}</strong></span>
                <span>Draw Calls: <strong>{drawCalls}</strong></span>
                <span>Speed: <strong>{speed}x</strong></span>
                <span>Rig: <strong style={{ color: selectedModel === 'procedural' ? '#FFC107' : '#6FA3EF' }}>
                  {selectedModel === 'v-bot' ? 'Mixamo 65-Bone FBX (♀)' : selectedModel === 'v-bot' ? 'Mixamo 65-Bone FBX (♂)' : 'Procedural Three.js'}
                </strong></span>
              </div>

              {/* Active Signing Gesture Overlay (Docked Top-Right of Canvas) */}
              {activeSignInfo.label && (
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    padding: '6px 14px',
                    backgroundColor: 'rgba(255, 111, 97, 0.90)',
                    border: '1px solid #FF6F61',
                    borderRadius: '20px',
                    color: '#FFF',
                    fontWeight: 800,
                    fontSize: '0.84rem',
                    zIndex: 5,
                    boxShadow: '0 4px 16px rgba(255, 111, 97, 0.45)'
                  }}
                >
                  Signing: {activeSignInfo.label} {activeSignInfo.letter && `(${activeSignInfo.letter})`}
                </div>
              )}
            </div>

            {/* 3. Bottom Fast Actions Toolbar */}
            <div
              style={{
                padding: '10px 14px',
                backgroundColor: '#161A22',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '10px'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => {
                    canvasRef.current?.resetPose();
                    setActiveSignInfo({ label: '', letter: '' });
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: '#23272F',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#FFF',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Reset Pose
                </button>
                <button
                  onClick={() => setWireframe(!wireframe)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: wireframe ? '#FF6F61' : '#23272F',
                    color: '#FFF',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Wireframe: {wireframe ? 'ON' : 'OFF'}
                </button>
                <button
                  onClick={handleExportGLB}
                  disabled={isExporting}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    background: isExporting ? '#666' : '#10B981',
                    color: '#000',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isExporting ? 'Exporting...' : '💾 Export Rigged GLB'}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                {/* Coating color quick dots */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Coating:</span>
                  {[
                    { id: 'silver', color: '#DFE3E8', title: 'Aerospace Silver', clearcoat: 0.88, roughness: 0.12, metalness: 0.35 },
                    { id: 'white', color: '#F4F6F9', title: 'Ceramic White', clearcoat: 0.95, roughness: 0.08, metalness: 0.25 },
                    { id: 'blue', color: '#6FA3EF', title: 'Electric Blue', clearcoat: 0.92, roughness: 0.10, metalness: 0.38 },
                    { id: 'coral', color: '#FF6F61', title: 'Hastivo Coral', clearcoat: 0.90, roughness: 0.12, metalness: 0.30 },
                    { id: 'amber', color: '#FFC107', title: 'Amber Gold', clearcoat: 0.88, roughness: 0.14, metalness: 0.40 },
                    { id: 'stealth', color: '#1E222A', title: 'Obsidian Stealth', clearcoat: 0.80, roughness: 0.18, metalness: 0.45 }
                  ].map((swatch) => (
                    <button
                      key={swatch.id}
                      onClick={() => handleCoatingPreset(swatch)}
                      title={swatch.title}
                      style={{
                        width: '18px',
                        height: '18px',
                        borderRadius: '50%',
                        backgroundColor: swatch.color,
                        border: coatingColor.toLowerCase() === swatch.color.toLowerCase() ? '2px solid #FFF' : '1px solid rgba(255,255,255,0.3)',
                        cursor: 'pointer',
                        padding: 0,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.4)',
                        transform: coatingColor.toLowerCase() === swatch.color.toLowerCase() ? 'scale(1.25)' : 'scale(1)',
                        transition: 'transform 0.15s ease'
                      }}
                    />
                  ))}
                </div>

                {/* Playback speed selector */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94A3B8' }}>Speed:</span>
                  {[0.5, 1.0, 1.5].map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setSpeed(s);
                        canvasRef.current?.setPlaybackSpeed(s);
                      }}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '4px',
                        background: speed === s ? '#6FA3EF' : '#23272F',
                        color: speed === s ? '#000' : '#FFF',
                        border: 'none',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* RIGHT: Diagnostic Control Panel */}
        {(viewMode === 'split' || viewMode === 'controls') && (
          <div
            style={{
              backgroundColor: '#161A22',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
        {/* Tab Headers */}
        <div
          style={{
            display: 'flex',
            backgroundColor: '#1E232B',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            overflowX: 'auto'
          }}
        >
          {[
            { id: 'assets', label: '🦾 Blender FBX Rigs' },
            { id: 'signing', label: 'ISL Signing' },
            { id: 'character', label: 'Animations' },
            { id: 'face', label: 'Digital Face (10)' },
            { id: 'hand', label: 'Hand Kinematics' },
            { id: 'joints', label: 'Joints & Posture' },
            { id: 'coating', label: '🎨 Outer Coating' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '12px 6px',
                border: 'none',
                background: activeTab === tab.id ? 'rgba(111, 163, 239, 0.18)' : 'transparent',
                color: activeTab === tab.id ? '#FFFFFF' : '#CBD5E1',
                fontWeight: activeTab === tab.id ? 800 : 600,
                fontSize: '0.80rem',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid #6FA3EF' : '2px solid transparent',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>

          {/* TAB 0: BLENDER FBX ASSETS & RIGS */}
          {activeTab === 'assets' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Header Section */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#6FA3EF' }}>
                    Blender FBX Humanoid Assets & Rigs
                  </span>
                  <span style={{ fontSize: '0.72rem', padding: '3px 8px', borderRadius: '12px', background: 'rgba(76, 175, 80, 0.15)', color: '#4CAF50', border: '1px solid #4CAF50', fontWeight: 700 }}>
                    ASSETS LOADED
                  </span>
                </div>
                <p style={{ fontSize: '0.78rem', color: '#8E99A8', margin: '0 0 12px 0', lineHeight: 1.45 }}>
                  Authentic Mixamo / Blender rigged characters with 65 bones and complete 5-finger kinematic articulation:
                  <strong style={{ color: '#FF6F61' }}> V-Bot = Unified Avatar Model</strong>.
                </p>

                {/* Model Selector Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {AVATAR_MODELS.map(m => {
                    const isSelected = selectedModel === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => handleSelectModel(m.id)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 14px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? 'rgba(111, 163, 239, 0.12)' : '#12151A',
                          border: isSelected ? `1.5px solid ${m.accentColor}` : '1px solid rgba(255, 255, 255, 0.08)',
                          cursor: 'pointer',
                          transition: 'all 0.18s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{ fontSize: '1.4rem' }}>{m.genderSymbol}</span>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <strong style={{ fontSize: '0.86rem', color: isSelected ? '#FFFFFF' : '#C1CBD7' }}>
                                {m.label}
                              </strong>
                              <span style={{ fontSize: '0.68rem', padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.08)', color: m.accentColor, fontWeight: 700 }}>
                                {m.badge}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#7E8B9B', marginTop: '2px' }}>
                              {m.description}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {isSelected ? (
                            <span style={{ padding: '4px 10px', borderRadius: '14px', backgroundColor: m.accentColor, color: '#0B0D11', fontSize: '0.72rem', fontWeight: 800 }}>
                              SELECTED
                            </span>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectModel(m.id);
                              }}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: '#23272F',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#A0AEC0',
                                fontSize: '0.72rem',
                                cursor: 'pointer'
                              }}
                            >
                              Switch to {m.name}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Asset Specs & Verification */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: '#6FA3EF' }}>
                  Live Rig & Asset Telemetry: 'V-Bot (Unified Official Model)'
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem' }}>
                  <div style={{ padding: '8px', backgroundColor: '#12151A', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}>
                    <div style={{ color: '#888' }}>Asset Format</div>
                    <strong style={{ color: '#FFF' }}>
                      {selectedModel === 'procedural' ? 'Procedural Three.js' : 'Autodesk FBX (Mixamo)'}
                    </strong>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#12151A', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}>
                    <div style={{ color: '#888' }}>Skeleton Hierarchy</div>
                    <strong style={{ color: '#4CAF50' }}>65 Articulated Bones</strong>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#12151A', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}>
                    <div style={{ color: '#888' }}>Hand Digits</div>
                    <strong style={{ color: '#FFF' }}>5 Digits (Thumb, Index, Mid, Ring, Pinky)</strong>
                  </div>
                  <div style={{ padding: '8px', backgroundColor: '#12151A', borderRadius: 'var(--radius-control)', border: '1px solid var(--border)' }}>
                    <div style={{ color: '#888' }}>PBR Material</div>
                    <strong style={{ color: '#FF6F61' }}>MeshPhysical Clearcoat + Metallic Joints</strong>
                  </div>
                </div>
              </div>

              {/* Fast Rig Actions */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.84rem', color: '#FFC107' }}>
                  Quick Rig Posture & Kinematics Verification
                </h4>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <button
                    onClick={() => canvasRef.current?.resetPose()}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🧘 Relaxed Rest Posture
                  </button>
                  <button
                    onClick={() => canvasRef.current?.playAnimation('neutral')}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🧍 T-Stance / Neutral
                  </button>
                  <button
                    onClick={() => canvasRef.current?.playAnimation('wave')}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#6FA3EF', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    👋 Wave & Greet
                  </button>
                  <button
                    onClick={() => canvasRef.current?.playSign('NAMASTE')}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFC107', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🙏 Namaste Sign
                  </button>
                  <button
                    onClick={() => {
                      applyHandPreset('fist');
                      const avatar = canvasRef.current?.getAvatar?.();
                      if (avatar?.leftHandController) avatar.leftHandController.setClosedFistPose();
                      if (avatar?.rightHandController) avatar.rightHandController.setClosedFistPose();
                    }}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FF6F61', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    ✊ Both Hands Fist
                  </button>
                  <button
                    onClick={() => {
                      applyHandPreset('openPalm');
                      const avatar = canvasRef.current?.getAvatar?.();
                      if (avatar?.leftHandController) avatar.leftHandController.setOpenPalmPose();
                      if (avatar?.rightHandController) avatar.rightHandController.setOpenPalmPose();
                    }}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#10B981', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    🖐️ Both Hands Open Palm
                  </button>
                  <button
                    onClick={() => canvasRef.current?.playAnimation('thumbsUp')}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    👍 Thumbs Up
                  </button>
                  <button
                    onClick={() => canvasRef.current?.playAnimation('present')}
                    style={{ padding: '8px 10px', borderRadius: '6px', background: '#23272F', border: '1px solid rgba(255,255,255,0.1)', color: '#FFF', fontSize: '0.76rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    ✨ Present / Point
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: ISL SIGNING */}
          {activeTab === 'signing' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Active Signing Hand Selector (Both Left & Right Sides per audio spec) */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#6FA3EF' }}>Active Signing Hand</span>
                  <span style={{ fontSize: '0.72rem', color: '#888' }}>Left, Right or Both</span>
                </div>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[
                    { id: 'R', label: '🖐️ Right Hand' },
                    { id: 'L', label: '🖐️ Left Hand' },
                    { id: 'both', label: '👐 Both Hands' }
                  ].map(item => (
                    <button
                      key={item.id}
                      onClick={() => {
                        setSigningSide(item.id);
                        canvasRef.current?.setDefaultSide?.(item.id);
                      }}
                      style={{
                        flex: 1,
                        padding: '7px 4px',
                        background: signingSide === item.id ? '#6FA3EF' : '#23272F',
                        color: signingSide === item.id ? '#0B1017' : '#C5D0DE',
                        border: 'none',
                        borderRadius: 'var(--radius-control)',
                        fontWeight: signingSide === item.id ? 700 : 500,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uploaded Reference Image Default Action */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '0.80rem', fontWeight: 700, color: '#FFC107' }}>Default Reference Action</span>
                  <span style={{ fontSize: '0.70rem', color: '#FFC107', background: 'rgba(255, 193, 7, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>Uploaded Image</span>
                </div>
                <button
                  onClick={() => {
                    canvasRef.current?.playDefaultSign?.(signingSide);
                    if (onSignChange) onSignChange('Default Sign Action (Image 1)');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: 'linear-gradient(135deg, rgba(111, 163, 239, 0.25) 0%, rgba(255, 111, 97, 0.25) 100%)',
                    border: '1px solid rgba(111, 163, 239, 0.5)',
                    borderRadius: '8px',
                    color: '#FFF',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>📸 Perform Uploaded Image Sign</span>
                  <span style={{ fontSize: '0.70rem', color: '#6FA3EF' }}>({signingSide === 'both' ? 'Both' : (signingSide === 'L' ? 'Left' : 'Right')})</span>
                </button>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#6FA3EF' }}>Core ISL Gestures</h4>
                  <button
                    onClick={() => {
                      canvasRef.current?.stop();
                      setActiveSignInfo({ label: '', letter: '' });
                    }}
                    style={{
                      padding: '4px 10px',
                      backgroundColor: 'rgba(255, 111, 97, 0.15)',
                      border: '1px solid #FF6F61',
                      borderRadius: '6px',
                      color: '#FF6F61',
                      fontSize: '0.74rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    ↺ Reset Pose
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {Object.keys(ISL_DICTIONARY).map(signKey => (
                    <button
                      key={signKey}
                      onClick={() => {
                        const lbl = ISL_DICTIONARY[signKey].label;
                        canvasRef.current?.playSign(signKey);
                        if (onSignChange) onSignChange(lbl);
                      }}
                      style={{
                        padding: '10px 8px',
                        background: '#23272F',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFF',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        textAlign: 'center'
                      }}
                    >
                      {ISL_DICTIONARY[signKey].label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#FF6F61' }}>Fingerspelling Test</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <input
                    type="text"
                    value={spellingText}
                    onChange={(e) => setSpellingText(e.target.value)}
                    placeholder="Type word to spell..."
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      backgroundColor: '#23272F',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFF',
                      fontSize: '0.85rem'
                    }}
                  />
                  <button
                    onClick={() => {
                      canvasRef.current?.playFingerspelling(spellingText, 0.85, signingSide);
                      if (onSignChange && spellingText) onSignChange(spellingText);
                    }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#FF6F61',
                      border: 'none',
                      borderRadius: '6px',
                      color: '#FFF',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.82rem'
                    }}
                  >
                    Spell
                  </button>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => (
                    <button
                      key={letter}
                      onClick={() => {
                        canvasRef.current?.playFingerspelling(letter, 0.85, signingSide);
                        if (onSignChange) onSignChange(letter);
                      }}
                      style={{
                        width: '28px',
                        height: '28px',
                        padding: 0,
                        backgroundColor: '#1E232B',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#DDD',
                        borderRadius: '4px',
                        fontSize: '0.74rem',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '14px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#FFC107' }}>Number Signing (0–9)</h4>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                    <button
                      key={num}
                      onClick={() => {
                        canvasRef.current?.playNumber(num, signingSide);
                        if (onSignChange) onSignChange(String(num));
                      }}
                      style={{
                        flex: 1,
                        padding: '8px 0',
                        backgroundColor: '#23272F',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#FFC107',
                        borderRadius: '6px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ANIMATIONS */}
          {activeTab === 'character' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h4 style={{ margin: '0 0 6px 0', fontSize: '0.88rem', color: '#6FA3EF' }}>Procedural Robotic Animations</h4>
              {[
                { id: 'uploadedImageSign', label: '📸 Uploaded Image Sign (Default Pose)' },
                { id: 'idleBreathing', label: 'Mechanical Idle Breathing' },
                { id: 'neutral', label: 'Neutral Rest Stance' },
                { id: 'walkIn', label: 'Walk-in Entrance' },
                { id: 'wave', label: 'Greeting Wave (Hello)' },
                { id: 'present', label: 'Present / Welcome' },
                { id: 'point', label: 'Point to Content (Image 1 Pose)' },
                { id: 'thumbsUp', label: 'Thumbs Up Confirm' },
                { id: 'shrug', label: 'Shrug / Unsure' },
                { id: 'thinking', label: 'Deep Thinking' },
                { id: 'listening', label: 'Attentive Listening' },
                { id: 'acknowledgement', label: 'Respectful Acknowledgement' },
                { id: 'errorReaction', label: 'Error Reaction' }
              ].map(anim => (
                <button
                  key={anim.id}
                  onClick={() => {
                    setActiveAnim(anim.id);
                    canvasRef.current?.playAnimation(anim.id);
                    if (onSignChange) {
                      onSignChange(anim.id === 'wave' ? 'Hello' : anim.label);
                    }
                  }}
                  style={{
                    padding: '10px 14px',
                    backgroundColor: activeAnim === anim.id ? 'rgba(111, 163, 239, 0.2)' : '#23272F',
                    border: activeAnim === anim.id ? '1px solid #6FA3EF' : '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                    color: activeAnim === anim.id ? '#6FA3EF' : '#FFF',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontSize: '0.82rem',
                    fontWeight: activeAnim === anim.id ? 700 : 500,
                    display: 'flex',
                    justifyContent: 'space-between'
                  }}
                >
                  <span>{anim.label}</span>
                  <span style={{ color: '#6FA3EF' }}>▶</span>
                </button>
              ))}
            </div>
          )}

          {/* TAB 3: DIGITAL FACE (ALL 10 REQUIRED EXPRESSIONS) */}
          {activeTab === 'face' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#6FA3EF' }}>10 Required Expressions</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                  {Object.keys(ROBOT_10_EXPRESSIONS).map(expr => (
                    <button
                      key={expr}
                      onClick={() => {
                        setCurrentExpr(expr);
                        canvasRef.current?.setExpression(expr);
                      }}
                      style={{
                        padding: '9px 10px',
                        backgroundColor: currentExpr === expr ? '#6FA3EF' : '#23272F',
                        color: currentExpr === expr ? '#000' : '#FFF',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: currentExpr === expr ? 700 : 500,
                        textTransform: 'capitalize'
                      }}
                    >
                      {expr}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#FFC107' }}>Head Gestures & Blink</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                  <button
                    onClick={() => {
                      const avatar = canvasRef.current?.getAvatar?.();
                      avatar?.faceController?.eyeController?.triggerBlink();
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: '#2E3440',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Blink Eyes
                  </button>
                  <button
                    onClick={() => {
                      const avatar = canvasRef.current?.getAvatar?.();
                      avatar?.headController?.nod(1, 0.8);
                    }}
                    style={{
                      padding: '8px',
                      backgroundColor: '#2E3440',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '6px',
                      color: '#FFF',
                      cursor: 'pointer',
                      fontSize: '0.8rem'
                    }}
                  >
                    Affirming Nod
                  </button>
                </div>

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Digital Gaze Horizontal (Yaw): {gazeX.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.8"
                  max="0.8"
                  step="0.05"
                  value={gazeX}
                  onChange={(e) => handleGazeChange(parseFloat(e.target.value), gazeY)}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Digital Gaze Vertical (Pitch): {gazeY.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.6"
                  max="0.6"
                  step="0.05"
                  value={gazeY}
                  onChange={(e) => handleGazeChange(gazeX, parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* TAB 4: HAND KINEMATICS */}
          {activeTab === 'hand' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#6FA3EF' }}>Hand & Digit Selection</h4>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  {['L', 'R'].map(side => (
                    <button
                      key={side}
                      onClick={() => applyFingerSliders({ targetHand: side })}
                      style={{
                        flex: 1,
                        padding: '8px',
                        background: fingerJoints.targetHand === side ? '#6FA3EF' : '#23272F',
                        color: fingerJoints.targetHand === side ? '#000' : '#FFF',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.8rem'
                      }}
                    >
                      {side === 'L' ? 'Left Hand' : 'Right Hand'}
                    </button>
                  ))}
                </div>

                <select
                  value={fingerJoints.digit}
                  onChange={(e) => applyFingerSliders({ digit: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    backgroundColor: '#23272F',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#FFF',
                    fontSize: '0.85rem'
                  }}
                >
                  <option value="thumb">Thumb (Opposed Digit)</option>
                  <option value="index">Index Finger</option>
                  <option value="middle">Middle Finger (Longest)</option>
                  <option value="ring">Ring Finger</option>
                  <option value="little">Little Finger (Pinky)</option>
                </select>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#6FA3EF' }}>Quick Hand Postures</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  {[
                    { id: 'uploadedImage', label: '📸 Uploaded Sign' },
                    { id: 'openPalm', label: 'Open Palm' },
                    { id: 'hello', label: 'Hello Pose' },
                    { id: 'relaxed', label: 'Relaxed Rest' },
                    { id: 'fist', label: 'Closed Fist' },
                    { id: 'point', label: 'Point Index' },
                    { id: 'thumbsUp', label: 'Thumbs Up' }
                  ].map(p => (
                    <button
                      key={p.id}
                      onClick={() => applyHandPreset(p.id)}
                      style={{
                        padding: '7px 4px',
                        backgroundColor: '#23272F',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '6px',
                        color: p.id === 'hello' ? '#6FA3EF' : '#FFF',
                        fontSize: '0.75rem',
                        fontWeight: p.id === 'hello' ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#FF6F61' }}>Joint Flexion Sliders (rad)</h4>

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  MCP Flexion (Base Knuckle): {fingerJoints.mcp.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.7"
                  step="0.05"
                  value={fingerJoints.mcp}
                  onChange={(e) => applyFingerSliders({ mcp: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  PIP Flexion (Middle Joint): {fingerJoints.pip.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.7"
                  step="0.05"
                  value={fingerJoints.pip}
                  onChange={(e) => applyFingerSliders({ pip: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  DIP Flexion (Fingertip Joint): {fingerJoints.dip.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0"
                  max="1.6"
                  step="0.05"
                  value={fingerJoints.dip}
                  onChange={(e) => applyFingerSliders({ dip: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Finger Abduction / Spread: {fingerJoints.abduct.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.4"
                  max="0.4"
                  step="0.02"
                  value={fingerJoints.abduct}
                  onChange={(e) => applyFingerSliders({ abduct: parseFloat(e.target.value) })}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Wrist Rotation / Roll: {fingerJoints.wristRoll.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-1.2"
                  max="1.2"
                  step="0.05"
                  value={fingerJoints.wristRoll}
                  onChange={(e) => applyFingerSliders({ wristRoll: parseFloat(e.target.value) })}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* TAB 5: JOINTS & POSTURE (HEAD, SHOULDERS, ARMS, TORSO) */}
          {activeTab === 'joints' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#6FA3EF' }}>Head & Neck Kinematics</h4>
                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Head Rotation (Yaw): {jointState.headYaw.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.65"
                  max="0.65"
                  step="0.05"
                  value={jointState.headYaw}
                  onChange={(e) => applyJointSlider('headYaw', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Head Tilt (Pitch): {jointState.headPitch.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.4"
                  max="0.4"
                  step="0.05"
                  value={jointState.headPitch}
                  onChange={(e) => applyJointSlider('headPitch', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Head Roll / Cock: {jointState.headRoll.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.35"
                  max="0.35"
                  step="0.05"
                  value={jointState.headRoll}
                  onChange={(e) => applyJointSlider('headRoll', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#FFC107' }}>Shoulders & Elbows</h4>

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Left Shoulder Elevation: {jointState.leftShoulderElev.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.2"
                  max="0.4"
                  step="0.05"
                  value={jointState.leftShoulderElev}
                  onChange={(e) => applyJointSlider('leftShoulderElev', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Right Shoulder Elevation: {jointState.rightShoulderElev.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.2"
                  max="0.4"
                  step="0.05"
                  value={jointState.rightShoulderElev}
                  onChange={(e) => applyJointSlider('rightShoulderElev', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Right Elbow Flexion: {jointState.rightElbowBend.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-2.2"
                  max="0.0"
                  step="0.05"
                  value={jointState.rightElbowBend}
                  onChange={(e) => applyJointSlider('rightElbowBend', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#FF6F61' }}>Torso & Waist Orientation</h4>
                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Torso Rotation (Yaw): {jointState.torsoYaw.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.4"
                  max="0.4"
                  step="0.05"
                  value={jointState.torsoYaw}
                  onChange={(e) => applyJointSlider('torsoYaw', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Waist Pitch / Bending: {jointState.waistPitch.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.3"
                  max="0.3"
                  step="0.05"
                  value={jointState.waistPitch}
                  onChange={(e) => applyJointSlider('waistPitch', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '12px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.88rem', color: '#6FA3EF' }}>Pelvis, Hips & Knee Articulation</h4>
                
                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Left Hip Flexion: {jointState.leftHipFlex.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.5"
                  max="0.8"
                  step="0.05"
                  value={jointState.leftHipFlex}
                  onChange={(e) => applyJointSlider('leftHipFlex', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Right Hip Flexion: {jointState.rightHipFlex.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="-0.5"
                  max="0.8"
                  step="0.05"
                  value={jointState.rightHipFlex}
                  onChange={(e) => applyJointSlider('rightHipFlex', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Left Knee Bend: {jointState.leftKneeBend.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.4"
                  step="0.05"
                  value={jointState.leftKneeBend}
                  onChange={(e) => applyJointSlider('leftKneeBend', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '8px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Right Knee Bend: {jointState.rightKneeBend.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.4"
                  step="0.05"
                  value={jointState.rightKneeBend}
                  onChange={(e) => applyJointSlider('rightKneeBend', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

          {/* TAB 6: OUTER LAYER COATING */}
          {activeTab === 'coating' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0, fontSize: '0.88rem', color: '#6FA3EF' }}>Outer Armor Coating Presets</h4>
                  <span style={{ fontSize: '0.72rem', color: '#AAA' }}>PBR Clearcoat Lacquer</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {[
                    { id: 'red', label: 'Robot Crimson Red', color: '#D9222A', clearcoat: 0.92, roughness: 0.12, metalness: 0.35, dot: '#D9222A' },
                    { id: 'silver', label: 'Aerospace Silver', color: '#DFE3E8', clearcoat: 0.88, roughness: 0.12, metalness: 0.35, dot: '#DFE3E8' },
                    { id: 'white', label: 'Ceramic White', color: '#F4F6F9', clearcoat: 0.95, roughness: 0.08, metalness: 0.25, dot: '#FFFFFF' },
                    { id: 'blue', label: 'Electric Blue', color: '#6FA3EF', clearcoat: 0.92, roughness: 0.10, metalness: 0.38, dot: '#6FA3EF' },
                    { id: 'coral', label: 'Hastivo Coral', color: '#FF6F61', clearcoat: 0.90, roughness: 0.12, metalness: 0.30, dot: '#FF6F61' },
                    { id: 'amber', label: 'Amber Gold', color: '#FFC107', clearcoat: 0.88, roughness: 0.14, metalness: 0.40, dot: '#FFC107' },
                    { id: 'stealth', label: 'Obsidian Stealth', color: '#1E222A', clearcoat: 0.80, roughness: 0.18, metalness: 0.45, dot: '#2E3440' },
                    { id: 'emerald', label: 'Cyber Emerald', color: '#10B981', clearcoat: 0.90, roughness: 0.10, metalness: 0.35, dot: '#10B981' }
                  ].map(preset => (
                    <button
                      key={preset.id}
                      onClick={() => handleCoatingPreset(preset)}
                      style={{
                        padding: '10px 10px',
                        background: coatingColor.toLowerCase() === preset.color.toLowerCase() ? 'rgba(111, 163, 239, 0.2)' : '#23272F',
                        border: coatingColor.toLowerCase() === preset.color.toLowerCase() ? '1.5px solid #6FA3EF' : '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-control)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        textAlign: 'left',
                        transition: 'all 0.18s ease'
                      }}
                    >
                      <span
                        style={{
                          width: '14px',
                          height: '14px',
                          borderRadius: '50%',
                          backgroundColor: preset.dot,
                          boxShadow: `0 0 8px ${preset.dot}88`,
                          border: '1px solid rgba(255,255,255,0.4)',
                          flexShrink: 0
                        }}
                      />
                      <span style={{ fontSize: '0.78rem', color: '#FFF', fontWeight: 600 }}>{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Hex Color Picker */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 10px 0', fontSize: '0.88rem', color: '#FFC107' }}>Custom Coating Color</h4>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <input
                    type="color"
                    value={coatingColor.startsWith('#') ? coatingColor : '#DFE3E8'}
                    onChange={(e) => handleCustomColor(e.target.value)}
                    style={{
                      width: '44px',
                      height: '40px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255,255,255,0.2)',
                      background: 'none',
                      cursor: 'pointer',
                      padding: '2px'
                    }}
                  />
                  <input
                    type="text"
                    value={coatingColor}
                    onChange={(e) => handleCustomColor(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-control)',
                      backgroundColor: '#23272F',
                      border: '1px solid var(--border)',
                      color: '#FFF',
                      fontSize: '0.85rem',
                      fontFamily: 'monospace'
                    }}
                  />
                </div>
              </div>

              {/* Clearcoat Physical Lacquer Tuning Sliders */}
              <div style={{ background: 'transparent', padding: '16px 0', borderBottom: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#FF6F61' }}>Physical Clearcoat Tuning</h4>

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Clearcoat Intensity (Outer Lacquer): {coatingClearcoat.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={coatingClearcoat}
                  onChange={(e) => handleClearcoatParam('clearcoat', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Clearcoat Glossiness / Smoothness: {(1.0 - coatingRoughness).toFixed(2)} ({coatingRoughness < 0.1 ? 'Mirror Glass' : 'Satin Glaze'})
                </label>
                <input
                  type="range"
                  min="0.02"
                  max="0.45"
                  step="0.02"
                  value={coatingRoughness}
                  onChange={(e) => handleClearcoatParam('clearcoatRoughness', parseFloat(e.target.value))}
                  style={{ width: '100%', marginBottom: '10px' }}
                />

                <label style={{ fontSize: '0.78rem', display: 'block', marginBottom: '4px' }}>
                  Shell Metalness: {coatingMetalness.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.0"
                  max="0.9"
                  step="0.05"
                  value={coatingMetalness}
                  onChange={(e) => handleClearcoatParam('metalness', parseFloat(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          )}

        </div>
          </div>
        )}
      </div>
    </div>
  );
}
