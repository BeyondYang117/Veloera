import React, { useState, useEffect } from 'react';
import { API, showError, showSuccess, showWarning } from '../helpers';
import { Button, Form, Typography, Input, Select, Checkbox, Spin } from '@douyinfe/semi-ui';

const { Text } = Typography;

// 模拟数据，当 API 不可用时使用
const mockData = {
  defaultModel: 'gpt-4o',
  systemToken: '',
  enableUserToken: false,
  modelOptions: [
    { label: 'gpt-4o', value: 'gpt-4o' },
    { label: 'gpt-4', value: 'gpt-4' },
    { label: 'gpt-3.5-turbo', value: 'gpt-3.5-turbo' },
    { label: 'claude-3-opus', value: 'claude-3-opus' },
    { label: 'claude-3-sonnet', value: 'claude-3-sonnet' }
  ]
};

const AssistantSetting = () => {
  const [inputs, setInputs] = useState({
    defaultModel: mockData.defaultModel,
    systemToken: mockData.systemToken,
    enableUserToken: mockData.enableUserToken
  });
  const [loading, setLoading] = useState(false);
  const [modelOptions, setModelOptions] = useState(mockData.modelOptions);
  const [apiAvailable, setApiAvailable] = useState(true);

  const getOptions = async () => {
    try {
      const res = await API.get('/api/option');
      const { success, data } = res.data || res;
      if (success) {
        let assistantSettings = data.find(item => item.key === 'AssistantSettings');
        if (assistantSettings) {
          try {
            const settings = JSON.parse(assistantSettings.value);
            setInputs({
              defaultModel: settings.default_model || mockData.defaultModel,
              systemToken: settings.system_token || mockData.systemToken,
              enableUserToken: settings.enable_user_token === true
            });
          } catch (e) {
            console.error('解析AI小助手设置失败', e);
          }
        }
      } else {
        console.warn('获取设置失败，使用模拟数据');
        setApiAvailable(false);
      }
    } catch (error) {
      console.warn('API不可用，使用模拟数据', error);
      setApiAvailable(false);
    }
  };

  const getModels = async () => {
    try {
      const res = await API.get('/api/models');
      const { success, data } = res.data || res;
      if (success && Array.isArray(data) && data.length > 0) {
        const options = data.map(model => ({
          label: model,
          value: model
        }));
        setModelOptions(options);
      } else {
        console.warn('获取模型列表失败，使用模拟数据');
      }
    } catch (error) {
      console.warn('API不可用，使用模拟模型数据', error);
    }
  };

  useEffect(() => {
    getOptions();
    getModels();
  }, []);

  const updateOption = async () => {
    setLoading(true);
    try {
      if (!apiAvailable) {
        setTimeout(() => {
          showSuccess('模拟保存成功！(API不可用)');
          setLoading(false);
        }, 500);
        return;
      }
      
      const settings = {
        default_model: inputs.defaultModel,
        system_token: inputs.systemToken,
        enable_user_token: inputs.enableUserToken
      };
      
      const res = await API.put('/api/option', {
        key: 'AssistantSettings',
        value: JSON.stringify(settings)
      });
      
      if (res.data?.success || res.success) {
        showSuccess('保存成功！');
      } else {
        showError(res.data?.message || res.message || '保存失败');
      }
    } catch (error) {
      if (!apiAvailable) {
        showSuccess('模拟保存成功！(API不可用)');
      } else {
        showError('保存失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (value, name) => {
    setInputs({
      ...inputs,
      [name]: value
    });
  };

  const handleCheckboxChange = (checked) => {
    setInputs({
      ...inputs,
      enableUserToken: checked
    });
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <Text strong style={{ fontSize: '16px', marginBottom: '16px', display: 'block' }}>AI小助手设置</Text>
      {!apiAvailable && (
        <div style={{ marginBottom: '16px', padding: '8px', backgroundColor: 'rgba(255, 229, 143, 0.2)', borderRadius: '4px' }}>
          <Text type="warning">后端API不可用，显示模拟数据</Text>
        </div>
      )}
      <Text style={{ marginBottom: '16px', display: 'block' }}>
        AI小助手设置用于配置系统默认的AI模型和系统令牌。系统默认使用系统令牌，如果启用"启用用户令牌"选项，已登录用户将使用其自己的令牌。
      </Text>
      {loading ? (
        <Spin />
      ) : (
        <Form>
          <Form.Select
            field="defaultModel"
            label="默认模型"
            style={{ width: '100%' }}
            optionList={modelOptions}
            value={inputs.defaultModel}
            onChange={(value) => handleInputChange(value, 'defaultModel')}
          />
          <Form.Input
            field="systemToken"
            label="系统令牌"
            placeholder="输入系统令牌（sk-xxx）"
            value={inputs.systemToken}
            onChange={(value) => handleInputChange(value, 'systemToken')}
          />
          <Form.Checkbox
            field="enableUserToken"
            checked={inputs.enableUserToken}
            onChange={(checked) => handleCheckboxChange(checked)}
          >
            启用用户令牌（如果用户已登录）
          </Form.Checkbox>
          <Button type="primary" onClick={updateOption} style={{ marginTop: '16px' }}>保存</Button>
        </Form>
      )}
    </div>
  );
};

export default AssistantSetting; 